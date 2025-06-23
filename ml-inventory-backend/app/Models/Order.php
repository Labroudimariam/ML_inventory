<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'beneficiary_id',
        'user_id',
        'order_number',
        'type',
        'status',
        'total_amount',
        'total_quantity',
        'order_date',
        'expected_delivery_date',
        'notes',
        'approved_at',
        'approved_by'
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'expected_delivery_date' => 'datetime',
        'approved_at' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    public function beneficiary()
    {
        return $this->belongsTo(Beneficiary::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class)
            ->withPivot('quantity', 'unit_price', 'total_price')
            ->withTimestamps();
    }

    public function delivery()
    {
        return $this->hasOne(Delivery::class);
    }

    public function calculateTotals()
    {
        $this->total_quantity = $this->products->sum('pivot.quantity');
        $this->total_amount = $this->products->sum(function($product) {
            return $product->pivot->quantity * $product->pivot->unit_price;
        });
        $this->save();
    }
}