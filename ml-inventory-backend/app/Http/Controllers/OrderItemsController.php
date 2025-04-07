<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemsController extends Controller
{
    public function index()
    {
        return OrderItem::all();
    }

    public function show($id)
    {
        return OrderItem::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'unit_price' => 'required|numeric',
            'total_price' => 'required|numeric',
        ]);

        $orderItem = OrderItem::create($validated);
        return response()->json($orderItem, 201);
    }

    public function update(Request $request, $id)
    {
        $orderItem = OrderItem::findOrFail($id);

        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'unit_price' => 'required|numeric',
            'total_price' => 'required|numeric',
        ]);

        $orderItem->update($validated);
        return response()->json($orderItem);
    }

    public function destroy($id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->delete();
        return response()->json(['message' => 'Order item deleted']);
    }
}

