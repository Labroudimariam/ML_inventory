<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    //
    protected $fillable = ['name', 'type', 'start_date', 'end_date', 'filters', 'data', 'user_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
