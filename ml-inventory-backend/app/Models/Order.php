<?php

namespace App\Models;

use App\Models\User;
use App\Models\OrderItem;
use App\Models\Beneficiary;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = ['beneficiary_id', 'user_id', 'order_number', 'type', 'status', 'total_amount', 'notes'];

    public function beneficiary() {
        return $this->belongsTo(Beneficiary::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }
}
