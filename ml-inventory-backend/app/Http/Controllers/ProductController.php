<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::with('category')->get();
        return response()->json($products, Response::HTTP_OK);
    }

    /**
     * Store a newly created product in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'warehouse_id' => 'required|string|max:255',
            'quantity' => 'required|integer',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric',
            'threshold_value' => 'nullable|integer',
            'expiry_date' => 'nullable|date',
            'status' => 'required|in:in-stock,out-of-stock,low-stock',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);
        return response()->json($product, Response::HTTP_CREATED);
    }

    /**
     * Display the specified product.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return response()->json($product, Response::HTTP_OK);
    }

    /**
     * Update the specified product in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            
            // Manually handle FormData fields since validate() doesn't work well with FormData
            $data = [
                'name' => $request->input('name', $product->name),
                'category_id' => $request->input('category_id', $product->category_id),
                'warehouse_id' => $request->input('warehouse_id', $product->warehouse_id),
                'quantity' => $request->input('quantity', $product->quantity),
                'unit' => $request->input('unit', $product->unit),
                'price' => $request->input('price', $product->price),
                'threshold_value' => $request->input('threshold_value', $product->threshold_value),
                'expiry_date' => $request->input('expiry_date', $product->expiry_date),
                'status' => $request->input('status', $product->status),
                'description' => $request->input('description', $product->description),
            ];
    
            // Manual validation
            if (empty($data['name'])) {
                throw new \Exception("Name is required");
            }
            // Add other validations as needed...
    
            // Update product
            $product->fill($data);
    
            // Handle image
            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $product->image = $request->file('image')->store('products', 'public');
            }
    
            $product->save();
    
            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Product updated successfully'
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }



    /**
     * Remove the specified product from the database.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Delete associated image
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}