<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Model;

class Beneficiary extends Model
{
    //
    protected $fillable = ['name', 'email', 'phone', 'gender', 'address', 'city', 'state', 'country', 'postal_code', 'additional_info'];

    public function orders() {
        return $this->hasMany(Order::class);
    }
}
