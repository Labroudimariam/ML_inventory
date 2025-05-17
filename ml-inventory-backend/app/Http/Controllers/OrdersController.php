<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    public function index()
    {
        return Order::with(['beneficiary', 'user'])->get();
    }

    public function show($id)
    {
        return Order::with(['beneficiary', 'user'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'beneficiary_id' => 'required|exists:beneficiaries,id',
            'user_id' => 'required|exists:users,id',
            'order_number' => 'required|string|unique:orders,order_number',
            'type' => 'required|in:Semen,Liquid nitrogen,Insemination equipment,Other',
            'status' => 'required|in:Processing,Completed,Rejected,On Hold,In Transit',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:order_date',
            'notes' => 'nullable|string',
        ]);

        $order = Order::create($validated);
        return response()->json($order, 201);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'beneficiary_id' => 'required|exists:beneficiaries,id',
            'user_id' => 'required|exists:users,id',
            'order_number' => 'required|string|unique:orders,order_number,' . $id,
            'type' => 'required|in:Semen,Liquid nitrogen,Insemination equipment,Other',
            'status' => 'required|in:Processing,Completed,Rejected,On Hold,In Transit',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:order_date',
            'notes' => 'nullable|string',
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order deleted']);
    }
}