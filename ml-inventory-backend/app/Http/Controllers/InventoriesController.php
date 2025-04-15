<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoriesController extends Controller
{
    public function index()
    {
        return Inventory::with(['product', 'user'])->get();
    }
    
    public function show($id)
    {
        return Inventory::with(['product', 'user'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'movement_type' => 'required|in:in,out',
            'reason' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $inventory = Inventory::create($validated);
        return response()->json(Inventory::with(['product', 'user'])->find($inventory->id), 201);
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'movement_type' => 'required|in:in,out',
            'reason' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $inventory->update($validated);
        return response()->json(Inventory::with(['product', 'user'])->find($id));
    }

    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();
        return response()->json(['message' => 'Inventory record deleted']);
    }
}

