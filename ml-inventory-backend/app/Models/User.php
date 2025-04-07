<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory; 

    protected $fillable = [
        'name', 'email', 'username', 'date_of_birth', 'password',
        'address', 'permanent_address', 'city', 'country', 'postal_code', 'role', 'profile_picture'
    ];

    protected $hidden = ['password', 'remember_token'];

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [];
    }
}
