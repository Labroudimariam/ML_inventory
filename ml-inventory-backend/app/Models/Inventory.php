<?php

namespace App\Models;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    //
    protected $fillable = ['product_id','warehouse_id', 'quantity', 'movement_type', 'reason', 'user_id'];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function warehouse() {
        return $this->belongsTo(Warehouse::class);
    }
}
