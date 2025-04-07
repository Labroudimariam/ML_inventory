<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // Register method
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'date_of_birth' => 'required|date',
            'address' => 'required|string',
            'permanent_address' => 'nullable|string', 
            'city' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'nullable|string',
            'role' => 'required|in:admin,subadmin,storekeeper',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Handling profile picture upload
        $profilePicturePath = null;

        if ($request->hasFile('profile_picture')) {
            // Store image in public/profile_pictures
            $profilePicturePath = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        // Create new user
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'date_of_birth' => $request->date_of_birth,
            'password' => Hash::make($request->password),
            'address' => $request->address,
            'permanent_address' => $request->permanent_address,
            'city' => $request->city,
            'country' => $request->country,
            'postal_code' => $request->postal_code,
            'role' => $request->role,
            'profile_picture' => $profilePicturePath, 
        ]);

        // Generate JWT token for the user
        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // Login method
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
    
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    
        // Get the authenticated user
        $user = auth()->user();
    
        return response()->json([
            'token' => $token,
            'user' => $user,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    // Get the authenticated user
    public function me()
    {
        try {
            // Retrieve the authenticated user
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json($user);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'User not found'], 401);
        }
    }

    // Logout the user
    public function logout()
    {
        // Invalidate the JWT token
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Déconnecté']);
    }
}
