<?php

namespace App\Http\Controllers;

use App\Models\Beneficiary;
use Illuminate\Http\Request;

class BeneficiariesController extends Controller
{
    public function index()
    {
        return Beneficiary::all();
    }

    public function show($id)
    {
        return Beneficiary::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:beneficiaries,email',
            'phone' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'required|string',
            'additional_info' => 'nullable|string',
            'nombre_insemination_artificielle' => 'required|integer|min:1',
        ]);

        $beneficiary = Beneficiary::create($validated);
        return response()->json($beneficiary, 201);
    }

    public function update(Request $request, $id)
    {
        $beneficiary = Beneficiary::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:beneficiaries,email,' . $id,
            'phone' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'required|string',
            'additional_info' => 'nullable|string',
            'nombre_insemination_artificielle' => 'required|integer|min:1',
        ]);

        $beneficiary->update($validated);
        return response()->json($beneficiary);
    }

    public function destroy($id)
    {
        $beneficiary = Beneficiary::findOrFail($id);
        $beneficiary->delete();
        return response()->json(['message' => 'Beneficiary deleted']);
    }
}

