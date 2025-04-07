<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function index()
    {
        return Report::all();
    }

    public function show($id)
    {
        return Report::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Sales,Inventory,Beneficiary,Order',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'filters' => 'nullable|json',
            'data' => 'nullable|json',
            'user_id' => 'required|exists:users,id',
        ]);

        $report = Report::create($validated);
        return response()->json($report, 201);
    }

    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Sales,Inventory,Beneficiary,Order',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'filters' => 'nullable|json',
            'data' => 'nullable|json',
            'user_id' => 'required|exists:users,id',
        ]);

        $report->update($validated);
        return response()->json($report);
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['message' => 'Report deleted']);
    }
}
