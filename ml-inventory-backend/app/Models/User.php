<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'username',
        'phone',
        'gender',
        'cin',
        'date_of_birth',
        'address',
        'permanent_address',
        'city',
        'country',
        'postal_code',
        'role',
        'profile_picture',
        'is_driver',
        'driver_license_number',
        'vehicle_type',
        'vehicle_registration',
        'password'
    ];

    protected $hidden = ['password', 'remember_token'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // public function setPasswordAttribute($value)
    // {
    //     $this->attributes['password'] = Hash::make($value);
    // }

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function deliveries()
    {
        return $this->hasMany(Delivery::class, 'driver_id');
    }

    public function validatedDeliveries()
    {
        return $this->hasMany(Delivery::class, 'validated_by');
    }

    public function inboxes()
    {
        return $this->hasMany(Inbox::class);
    }



    // 
    protected $appends = ['profile_picture_url'];

    public function getProfilePictureUrlAttribute()
    {
        if (!$this->profile_picture) {
            return null;
        }

        // Debug output - check what path is being generated
        Log::debug("Profile picture path: ", [
            'database_value' => $this->profile_picture,
            'storage_exists' => Storage::disk('public')->exists($this->profile_picture),
            'full_path' => storage_path('app/public/' . $this->profile_picture),
            'generated_url' => asset('storage/' . $this->profile_picture)
        ]);

        return asset('storage/' . $this->profile_picture);
    }
}
