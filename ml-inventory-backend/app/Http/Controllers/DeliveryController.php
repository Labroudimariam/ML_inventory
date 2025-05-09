<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeliveryController extends Controller
{
    public function index()
    {
        return Delivery::with(['order', 'warehouse', 'driver', 'validator'])->get();
    }

    public function show($id)
    {
        return Delivery::with(['order', 'warehouse', 'driver', 'validator'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'driver_id' => 'nullable|exists:users,id',
            'requires_validation' => 'boolean',
            'from_location' => 'required|string',
            'from_latitude' => 'nullable|numeric',
            'from_longitude' => 'nullable|numeric',
            'to_location' => 'required|string',
            'to_latitude' => 'nullable|numeric',
            'to_longitude' => 'nullable|numeric',
            'status' => 'required|in:draft,validated,preparing,dispatched,in_transit,out_for_delivery,delivered,cancelled',
            'recipient_name' => 'required|string',
            'delivery_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $delivery = Delivery::create($request->all());
        return response()->json($delivery, 201);
    }

    public function update(Request $request, $id)
    {
        $delivery = Delivery::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'order_id' => 'sometimes|exists:orders,id',
            'warehouse_id' => 'sometimes|exists:warehouses,id',
            'driver_id' => 'nullable|exists:users,id',
            'status' => 'sometimes|in:draft,validated,preparing,dispatched,in_transit,out_for_delivery,delivered,cancelled',
            'from_location' => 'sometimes|string',
            'from_latitude' => 'nullable|numeric',
            'from_longitude' => 'nullable|numeric',
            'to_location' => 'sometimes|string',
            'to_latitude' => 'nullable|numeric',
            'to_longitude' => 'nullable|numeric',
            'current_location' => 'nullable|string',
            'current_latitude' => 'nullable|numeric',
            'current_longitude' => 'nullable|numeric',
            'recipient_name' => 'sometimes|string',
            'recipient_signature' => 'nullable|string',
            'delivery_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Status transitions
        if ($request->has('status')) {
            $allowedStatusTransitions = [
                'draft' => ['validated'],
                'validated' => ['preparing'],
                'preparing' => ['dispatched'],
                'dispatched' => ['in_transit'],
                'in_transit' => ['out_for_delivery'],
                'out_for_delivery' => ['delivered'],
            ];

            if (isset($allowedStatusTransitions[$delivery->status])) {
                if (!in_array($request->status, $allowedStatusTransitions[$delivery->status])) {
                    return response()->json(['error' => 'Invalid status transition'], 400);
                }
            }

            // Update timestamps based on status
            switch ($request->status) {
                case 'preparing':
                    $delivery->prepared_at = now();
                    break;
                case 'dispatched':
                    $delivery->dispatched_at = now();
                    break;
                case 'delivered':
                    $delivery->delivered_at = now();
                    break;
            }
        }

        $delivery->update($request->all());
        return response()->json($delivery);
    }

    public function validateDelivery(Request $request, $id)
    {
        $delivery = Delivery::findOrFail($id);

        if ($delivery->status !== 'draft') {
            return response()->json(['error' => 'Only draft deliveries can be validated'], 400);
        }

        $delivery->update([
            'validated_by' => auth()->id(),
            'validated_at' => now(),
            'validation_status' => 'approved',
            'status' => 'validated'
        ]);

        return response()->json($delivery);
    }

    public function track($id)
    {
        $delivery = Delivery::findOrFail($id);

        return response()->json([
            'current_location' => $delivery->current_location,
            'coordinates' => [
                'latitude' => $delivery->current_latitude,
                'longitude' => $delivery->current_longitude,
            ],
            'status' => $delivery->status,
            'estimated_time' => $delivery->estimated_delivery_time,
        ]);
    }

    public function destroy($id)
    {
        $delivery = Delivery::findOrFail($id);
        $delivery->delete();

        return response()->json(['message' => 'Delivery deleted']);
    }
}
