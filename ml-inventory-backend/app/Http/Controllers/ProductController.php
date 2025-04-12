<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

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
            'warehouse' => 'required|string|max:255',
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
        DB::beginTransaction();
        
        try {
            $product = Product::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'category_id' => 'sometimes|exists:categories,id',
                'warehouse' => 'sometimes|string|max:255',
                'quantity' => 'sometimes|integer',
                'unit' => 'sometimes|string|max:50',
                'price' => 'sometimes|numeric',
                'status' => 'sometimes|in:in-stock,out-of-stock,low-stock',
                'image' => 'nullable|image|max:2048',
            ]);

            // Update each field individually
            foreach ($validated as $field => $value) {
                if ($field !== 'image') {
                    $product->{$field} = $value;
                }
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $product->image = $request->file('image')->store('products', 'public');
            }

            if (!$product->save()) {
                throw new \Exception('Failed to save product');
            }

            DB::commit();
            
            return response()->json([
                'success' => true,
                'data' => $product,
                'changes' => $product->getChanges()
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
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