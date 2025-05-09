<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = [
        'order_id', 'warehouse_id', 'driver_id', 'requires_validation', 'validated_by',
        'validated_at', 'validation_status', 'validation_notes', 'from_location',
        'from_latitude', 'from_longitude', 'to_location', 'to_latitude', 'to_longitude',
        'current_location', 'current_latitude', 'current_longitude', 'status',
        'prepared_at', 'dispatched_at', 'delivered_at', 'recipient_name',
        'recipient_signature', 'delivery_notes'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}
