<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'location', 'description', 'capacity', 'current_stock'
    ];

    public function storekeeper()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function inventories()
    {
        return $this->hasManyThrough(Inventory::class, Product::class);
    }

    public function deliveries()
    {
        return $this->hasMany(Delivery::class);
    }
}
