<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inbox extends Model
{
    //
    protected $fillable = [
        'user_id',
        'sender_email',
        'subject',
        'message',
        'read_at',
        'is_important',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
