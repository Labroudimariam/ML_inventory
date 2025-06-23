<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{
    public function index()
    {
        return Order::with(['beneficiary', 'user', 'products'])->get();
    }

    public function show($id)
    {
        return Order::with(['beneficiary', 'user', 'products'])->findOrFail($id);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'beneficiary_id' => 'required|exists:beneficiaries,id',
        'user_id' => 'required|exists:users,id',
        'order_number' => 'required|string|unique:orders,order_number',
        'type' => 'required|in:Semen,Liquid nitrogen,Insemination equipment,Other',
        'status' => 'required|in:Pending,Approved,Processing,Completed,Rejected',
        'order_date' => 'required|date',
        'expected_delivery_date' => 'nullable|date|after_or_equal:order_date',
        'notes' => 'nullable|string',
        'products' => 'required|array|min:1',
        'products.*.product_id' => 'required|exists:products,id',
        'products.*.quantity' => 'required|integer|min:1',
        'products.*.unit_price' => 'required|numeric|min:0',
    ]);

    DB::beginTransaction();

    try {
        $order = Order::create($validated);
        $productsData = [];
        $totalAmount = 0;
        $totalQuantity = 0;

        foreach ($request->products as $product) {
            $productModel = Product::findOrFail($product['product_id']);

            if ($productModel->quantity < $product['quantity']) {
                throw new \Exception("Stock insuffisant pour {$productModel->name}. Disponible: {$productModel->quantity}, Demandé: {$product['quantity']}");
            }

            $totalPrice = $product['quantity'] * $product['unit_price'];
            $productsData[$product['product_id']] = [
                'quantity' => $product['quantity'],
                'unit_price' => $product['unit_price'],
                'total_price' => $totalPrice
            ];

            $totalAmount += $totalPrice;
            $totalQuantity += $product['quantity'];

            // Update stock
            $productModel->decrement('quantity', $product['quantity']);

            Inventory::create([
                'product_id' => $product['product_id'],
                'warehouse_id' => $productModel->warehouse_id,
                'quantity' => $product['quantity'],
                'movement_type' => 'out',
                'reason' => 'Commande #' . $order->order_number,
                'user_id' => $validated['user_id']
            ]);
        }

        $order->products()->sync($productsData);
        $order->update([
            'total_amount' => $totalAmount,
            'total_quantity' => $totalQuantity
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Commande créée avec succès',
            'data' => $order->load(['beneficiary', 'user', 'products'])
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Échec de la création de commande',
            'error' => $e->getMessage()
        ], 400);
    }
}

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'beneficiary_id' => 'sometimes|exists:beneficiaries,id',
            'user_id' => 'sometimes|exists:users,id',
            'order_number' => 'sometimes|string|unique:orders,order_number,' . $id,
            'type' => 'sometimes|in:Semen,Liquid nitrogen,Insemination equipment,Other',
            'status' => 'sometimes|in:Pending,Approved,Processing,Completed,Rejected',
            'order_date' => 'sometimes|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:order_date',
            'notes' => 'nullable|string',
            'products' => 'sometimes|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            // Update order details
            $order->update($validated);

            if ($request->has('products')) {
                $productsData = [];
                $currentProducts = $order->products->keyBy('id');

                foreach ($request->products as $product) {
                    $productModel = Product::findOrFail($product['product_id']);
                    $currentQuantity = $currentProducts[$product['product_id']]->pivot->quantity ?? 0;
                    $quantityChange = $product['quantity'] - $currentQuantity;

                    // Check stock if increasing quantity
                    if ($quantityChange > 0 && $productModel->quantity < $quantityChange) {
                        throw new \Exception("Insufficient stock for product: {$productModel->name}. Available: {$productModel->quantity}, Needed: {$quantityChange}");
                    }

                    // Prepare product data
                    $productsData[$product['product_id']] = [
                        'quantity' => $product['quantity'],
                        'unit_price' => $product['unit_price'],
                        'total_price' => $product['quantity'] * $product['unit_price']
                    ];

                    // Update product stock
                    if ($quantityChange != 0) {
                        $productModel->increment('quantity', -$quantityChange);

                        // Create inventory record
                        Inventory::create([
                            'product_id' => $product['product_id'],
                            'warehouse_id' => $productModel->warehouse_id,
                            'quantity' => abs($quantityChange),
                            'movement_type' => $quantityChange > 0 ? 'out' : 'in',
                            'reason' => $quantityChange > 0 
                                ? 'Order increase #' . $order->order_number 
                                : 'Order reduction #' . $order->order_number,
                            'user_id' => $validated['user_id'] ?? $order->user_id
                        ]);
                    }
                }

                // Sync products
                $order->products()->sync($productsData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order updated successfully',
                'data' => $order->load(['beneficiary', 'user', 'products'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order update failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $order = Order::findOrFail($id);

            // Restore product quantities and create inventory records
            foreach ($order->products as $product) {
                $quantity = $product->pivot->quantity;
                $product->increment('quantity', $quantity);

                Inventory::create([
                    'product_id' => $product->id,
                    'warehouse_id' => $product->warehouse_id,
                    'quantity' => $quantity,
                    'movement_type' => 'in',
                    'reason' => 'Order cancellation #' . $order->order_number,
                    'user_id' => $order->user_id
                ]);
            }

            // Detach products and delete order
            $order->products()->detach();
            $order->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}