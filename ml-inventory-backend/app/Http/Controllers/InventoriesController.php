<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class InventoriesController extends Controller
{
    public function index()
    {
        return Inventory::with(['product', 'user', 'warehouse'])->get();
    }

    public function show($id)
    {
        return Inventory::with(['product', 'user', 'warehouse'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity' => 'required|integer|min:1',
            'movement_type' => 'required|in:in,out',
            'reason' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        // Vérifier le stock si c'est un mouvement de sortie
        if ($validated['movement_type'] === 'out') {
            $product = Product::find($validated['product_id']);
            $currentStock = $product->quantity;
            
            if ($currentStock < $validated['quantity']) {
                return response()->json([
                    'message' => 'Stock insuffisant',
                    'current_stock' => $currentStock
                ], 400);
            }
        }

        $inventory = Inventory::create($validated);

        // Mettre à jour le stock du produit
        $product = Product::find($validated['product_id']);
        if ($validated['movement_type'] === 'in') {
            $product->quantity += $validated['quantity'];
        } else {
            $product->quantity -= $validated['quantity'];
        }

        // Mettre à jour le statut du produit en fonction du nouveau stock
        if ($product->quantity <= 0) {
            $product->status = 'out-of-stock';
        } elseif ($product->threshold_value && $product->quantity <= $product->threshold_value) {
            $product->status = 'low-stock';
        } else {
            $product->status = 'in-stock';
        }

        $product->save();

        // Mettre à jour le stock de l'entrepôt
        $warehouse = Warehouse::find($validated['warehouse_id']);
        $warehouse->current_stock = $warehouse->products()->sum('quantity');
        $warehouse->save();

        return response()->json(Inventory::with(['product', 'user', 'warehouse'])->find($inventory->id), 201);
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity' => 'required|integer|min:1',
            'movement_type' => 'required|in:in,out',
            'reason' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        // Annuler l'ancien mouvement avant d'appliquer le nouveau
        $product = Product::find($inventory->product_id);
        if ($inventory->movement_type === 'in') {
            $product->quantity -= $inventory->quantity;
        } else {
            $product->quantity += $inventory->quantity;
        }

        // Vérifier le stock si c'est un nouveau mouvement de sortie
        if ($validated['movement_type'] === 'out') {
            $currentStock = $product->quantity;
            if ($currentStock < $validated['quantity']) {
                return response()->json([
                    'message' => 'Stock insuffisant',
                    'current_stock' => $currentStock
                ], 400);
            }
        }

        // Appliquer le nouveau mouvement
        if ($validated['movement_type'] === 'in') {
            $product->quantity += $validated['quantity'];
        } else {
            $product->quantity -= $validated['quantity'];
        }

        // Mettre à jour le statut du produit
        if ($product->quantity <= 0) {
            $product->status = 'out-of-stock';
        } elseif ($product->threshold_value && $product->quantity <= $product->threshold_value) {
            $product->status = 'low-stock';
        } else {
            $product->status = 'in-stock';
        }

        $product->save();

        // Mettre à jour l'enregistrement d'inventaire
        $inventory->update($validated);

        // Mettre à jour le stock de l'entrepôt
        $warehouse = Warehouse::find($validated['warehouse_id']);
        $warehouse->current_stock = $warehouse->products()->sum('quantity');
        $warehouse->save();

        return response()->json(Inventory::with(['product', 'user', 'warehouse'])->find($inventory->id));
    }

    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);

        // Annuler l'effet du mouvement sur le stock
        $product = Product::find($inventory->product_id);
        if ($inventory->movement_type === 'in') {
            $product->quantity -= $inventory->quantity;
        } else {
            $product->quantity += $inventory->quantity;
        }

        // Mettre à jour le statut du produit
        if ($product->quantity <= 0) {
            $product->status = 'out-of-stock';
        } elseif ($product->threshold_value && $product->quantity <= $product->threshold_value) {
            $product->status = 'low-stock';
        } else {
            $product->status = 'in-stock';
        }

        $product->save();

        // Mettre à jour le stock de l'entrepôt
        $warehouse = Warehouse::find($inventory->warehouse_id);
        $warehouse->current_stock = $warehouse->products()->sum('quantity');
        $warehouse->save();

        $inventory->delete();

        return response()->json(['message' => 'Inventory record deleted']);
    }
}