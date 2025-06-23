<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with(['category', 'warehouse'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'threshold_value' => 'nullable|integer|min:0',
            'expiry_date' => 'nullable|date|after:today',
            'status' => 'required|in:in-stock,out-of-stock,low-stock',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'barcode' => 'nullable|string|unique:products,barcode',
        ]);

        DB::beginTransaction();

        try {
            // Handle image upload
            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('products', 'public');
            }

            // Auto-set status based on quantity and threshold
            $validated['status'] = $this->calculateStockStatus(
                $validated['quantity'],
                $validated['threshold_value'] ?? null
            );

            $product = Product::create($validated);

            // Update warehouse stock
            $this->updateWarehouseStock($validated['warehouse_id']);

            DB::commit();

            return response()->json($product->load(['category', 'warehouse']), Response::HTTP_CREATED);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Product creation failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function show($id)
    {
        $product = Product::with(['category', 'warehouse'])->findOrFail($id);
        $product->append(['stock', 'image_url']);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'warehouse_id' => 'sometimes|exists:warehouses,id',
            'quantity' => 'sometimes|integer|min:0',
            'unit' => 'sometimes|string|max:50',
            'price' => 'sometimes|numeric|min:0',
            'threshold_value' => 'nullable|integer|min:0',
            'expiry_date' => 'nullable|date|after:today',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'barcode' => 'nullable|string|unique:products,barcode,' . $id,
        ]);

        DB::beginTransaction();

        try {
            // Handle image update
            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $validated['image'] = $request->file('image')->store('products', 'public');
            }

            // Auto-update status based on quantity and threshold
            if (isset($validated['quantity'])) {
                $threshold = $validated['threshold_value'] ?? $product->threshold_value;
                $validated['status'] = $this->calculateStockStatus($validated['quantity'], $threshold);
            }

            // If warehouse changes, update both warehouses' stock
            $oldWarehouseId = $product->warehouse_id;
            $product->update($validated);

            if ($request->has('warehouse_id') || $request->has('quantity')) {
                $this->updateWarehouseStock($oldWarehouseId);
                if ($request->has('warehouse_id')) {
                    $this->updateWarehouseStock($validated['warehouse_id']);
                }
            }

            DB::commit();
            return response()->json($product->load(['category', 'warehouse']));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Product update failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);

            // Delete associated image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $warehouseId = $product->warehouse_id;
            $product->delete();

            // Update warehouse stock
            $this->updateWarehouseStock($warehouseId);

            DB::commit();

            return response()->json(null, Response::HTTP_NO_CONTENT);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Product deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request)
    {
        $query = Product::query()->with(['category', 'warehouse']);

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        return response()->json($query->get());
    }

    public function checkStock($id)
    {
        $product = Product::findOrFail($id);
        return response()->json([
            'quantity' => $product->quantity,
            'status' => $product->status,
            'threshold' => $product->threshold_value,
            'is_low' => $product->status === 'low-stock',
            'is_out' => $product->status === 'out-of-stock'
        ]);
    }

    public function syncStock($id)
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);
            
            // Calculate real stock from inventory movements
            $totalIn = Inventory::where('product_id', $id)
                ->where('movement_type', 'in')
                ->sum('quantity');
            
            $totalOut = Inventory::where('product_id', $id)
                ->where('movement_type', 'out')
                ->sum('quantity');
            
            $realStock = $totalIn - $totalOut;
            
            // Update product only if necessary
            if ($product->quantity != $realStock) {
                $product->quantity = $realStock;
                $product->status = $this->calculateStockStatus($realStock, $product->threshold_value);
                $product->save();

                // Update warehouse stock
                $this->updateWarehouseStock($product->warehouse_id);
            }
            
            DB::commit();

            return response()->json([
                'previous_stock' => $product->quantity,
                'new_stock' => $realStock,
                'status' => $product->status
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Stock synchronization failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    protected function calculateStockStatus($quantity, $threshold = null)
    {
        if ($quantity <= 0) {
            return 'out-of-stock';
        } elseif ($threshold && $quantity <= $threshold) {
            return 'low-stock';
        }
        return 'in-stock';
    }

    protected function updateWarehouseStock($warehouseId)
    {
        if ($warehouseId) {
            $warehouse = Warehouse::find($warehouseId);
            if ($warehouse) {
                $warehouse->current_stock = $warehouse->products()->sum('quantity');
                $warehouse->save();
            }
        }
    }
}