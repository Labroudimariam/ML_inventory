<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'name',
        'image',
        'category_id',
        'warehouse_id',
        'quantity',
        'unit',
        'price',
        'threshold_value',
        'expiry_date',
        'status',
        'description',
        'barcode'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class)
            ->withPivot('quantity', 'unit_price', 'total_price')
            ->withTimestamps();
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function getStockAttribute()
    {
        $in = $this->inventories()->where('movement_type', 'in')->sum('quantity');
        $out = $this->inventories()->where('movement_type', 'out')->sum('quantity');
        return $in - $out;
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // Debug output - check what path is being generated
        Log::debug("Image path: ", [
            'database_value' => $this->image,
            'storage_exists' => Storage::disk('public')->exists($this->image),
            'full_path' => storage_path('app/public/' . $this->image),
            'generated_url' => asset('storage/' . $this->image)
        ]);

        return asset('storage/' . $this->image);
    }
}
