<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WarehouseController extends Controller
{
    public function index()
    {
        return Warehouse::with(['storekeeper', 'products'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'location' => 'required|string',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'current_stock' => 'nullable|integer|min:0',
        ]);

        $warehouse = Warehouse::create($validated);
        return response()->json($warehouse, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $warehouse = Warehouse::with(['storekeeper', 'products'])->findOrFail($id);
        return response()->json($warehouse);
    }

    public function update(Request $request, $id)
    {
        $warehouse = Warehouse::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'current_stock' => 'nullable|integer|min:0',
        ]);

        $warehouse->update($validated);
        return response()->json($warehouse);
    }

    public function destroy($id)
    {
        $warehouse = Warehouse::findOrFail($id);
        
        // Prevent deletion if warehouse contains products
        if ($warehouse->products()->count() > 0) {
            return response()->json(
                ['message' => 'Cannot delete warehouse with products. Move products first.'], 
                Response::HTTP_CONFLICT
            );
        }

        $warehouse->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function getProducts($warehouseId)
    {
        $products = Product::where('warehouse_id', $warehouseId)->get();
        return response()->json($products);
    }

    public function getInventory($warehouseId)
    {
        $inventory = Warehouse::with(['products' => function($query) {
            $query->with('category');
        }])->findOrFail($warehouseId);

        return response()->json($inventory);
    }

    public function getCapacity($warehouseId)
    {
        $warehouse = Warehouse::findOrFail($warehouseId);
        $usedCapacity = $warehouse->products()->sum('quantity');
        
        return response()->json([
            'total_capacity' => $warehouse->capacity,
            'used_capacity' => $usedCapacity,
            'available_capacity' => $warehouse->capacity - $usedCapacity
        ]);
    }
}