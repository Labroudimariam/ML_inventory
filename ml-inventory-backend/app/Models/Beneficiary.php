<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Model;

class Beneficiary extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'address', 'city', 'state', 'country', 'nombre_insemination_artificielle', 'postal_code', 'additional_info',];

    public function orders() {
        return $this->hasMany(Order::class);
    }
}
