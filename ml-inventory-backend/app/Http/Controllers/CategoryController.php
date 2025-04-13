<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::all(); // Fetch all categories
        return response()->json($categories, Response::HTTP_OK); // Return JSON response
    }

    /**
     * Store a newly created category in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated); // Create new category record
        return response()->json($category, Response::HTTP_CREATED); // Return newly created category
    }

    /**
     * Display the specified category.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $category = Category::findOrFail($id); // Find category by ID or fail
        return response()->json($category, Response::HTTP_OK); // Return category data
    }

    /**
     * Update the specified category in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id); // Find category by ID

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated); // Update category with new data
        return response()->json($category, Response::HTTP_OK); // Return updated category
    }

    /**
     * Remove the specified category from the database.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id); // Find category by ID
        $category->delete(); // Delete category record
        return response()->json(null, Response::HTTP_NO_CONTENT); // Return 204 No Content response
    }
}
