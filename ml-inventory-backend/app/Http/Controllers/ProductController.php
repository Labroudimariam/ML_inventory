<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Auto-set status based on quantity and threshold
        if ($validated['quantity'] <= 0) {
            $validated['status'] = 'out-of-stock';
        } elseif (isset($validated['threshold_value']) && $validated['quantity'] <= $validated['threshold_value']) {
            $validated['status'] = 'low-stock';
        } else {
            $validated['status'] = 'in-stock';
        }

        $product = Product::create($validated);
        
        // Update warehouse stock
        $warehouse = Warehouse::find($validated['warehouse_id']);
        $warehouse->current_stock = $warehouse->products()->sum('quantity');
        $warehouse->save();

        return response()->json($product->load(['category', 'warehouse']), Response::HTTP_CREATED);
    }

    public function show($id)
    {
        return Product::with(['category', 'warehouse'])->findOrFail($id);
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
            'barcode' => 'nullable|string|unique:products,barcode,'.$id,
        ]);

        // Handle image update
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Auto-update status based on quantity and threshold
        if (isset($validated['quantity'])) {
            $threshold = $validated['threshold_value'] ?? $product->threshold_value;
            
            if ($validated['quantity'] <= 0) {
                $validated['status'] = 'out-of-stock';
            } elseif ($threshold && $validated['quantity'] <= $threshold) {
                $validated['status'] = 'low-stock';
            } else {
                $validated['status'] = 'in-stock';
            }
        }

        $product->update($validated);
        
        // Update warehouse stock if quantity or warehouse changed
        if ($request->has('quantity') || $request->has('warehouse_id')) {
            $warehouseIds = array_unique([$product->warehouse_id, $request->warehouse_id ?? null]);
            
            foreach ($warehouseIds as $warehouseId) {
                if ($warehouseId) {
                    $warehouse = Warehouse::find($warehouseId);
                    $warehouse->current_stock = $warehouse->products()->sum('quantity');
                    $warehouse->save();
                }
            }
        }

        return response()->json($product->load(['category', 'warehouse']));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Delete associated image
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        
        $warehouseId = $product->warehouse_id;
        $product->delete();
        
        // Update warehouse stock
        $warehouse = Warehouse::find($warehouseId);
        $warehouse->current_stock = $warehouse->products()->sum('quantity');
        $warehouse->save();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function search(Request $request)
    {
        $query = Product::query()->with(['category', 'warehouse']);

        if ($request->has('name')) {
            $query->where('name', 'like', '%'.$request->name.'%');
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
}