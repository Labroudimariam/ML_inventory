<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Beneficiary;
use App\Models\User;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    public function index()
    {
        return Order::all();
    }

    public function show($id)
    {
        return Order::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'beneficiary_id' => 'required|exists:beneficiaries,id',
            'user_id' => 'required|exists:users,id',
            'order_number' => 'required|string|unique:orders,order_number',
            'type' => 'required|in:Book,Watch,Medicine,Mobile,Electric,Fashion,Other',
            'status' => 'required|in:Processing,Completed,Rejected,On Hold,In Transit',
            'total_amount' => 'required|numeric',
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
            'type' => 'required|in:Book,Watch,Medicine,Mobile,Electric,Fashion,Other',
            'status' => 'required|in:Processing,Completed,Rejected,On Hold,In Transit',
            'total_amount' => 'required|numeric',
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
