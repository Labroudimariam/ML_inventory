<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the warehouses.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $warehouses = Warehouse::all(); // Fetch all warehouses
        return response()->json($warehouses, Response::HTTP_OK); // Return JSON response
    }

    /**
     * Store a newly created warehouse in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $warehouse = Warehouse::create($validated); // Create new warehouse record
        return response()->json($warehouse, Response::HTTP_CREATED); // Return newly created warehouse
    }

    /**
     * Display the specified warehouse.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $warehouse = Warehouse::findOrFail($id); // Find warehouse by ID or fail
        return response()->json($warehouse, Response::HTTP_OK); // Return warehouse data
    }

    /**
     * Update the specified warehouse in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $warehouse = Warehouse::findOrFail($id); // Find warehouse by ID

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $warehouse->update($validated); // Update warehouse with new data
        return response()->json($warehouse, Response::HTTP_OK); // Return updated warehouse
    }

    /**
     * Remove the specified warehouse from the database.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $warehouse = Warehouse::findOrFail($id); // Find warehouse by ID
        $warehouse->delete(); // Delete warehouse record
        return response()->json(null, Response::HTTP_NO_CONTENT); // Return 204 No Content response
    }
}
