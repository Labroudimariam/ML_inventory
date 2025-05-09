<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        // Debug output
        foreach ($users as $user) {
            Log::debug("User {$user->id} profile URL: " . $user->profile_picture_url);
        }
        return response()->json($users, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'username' => 'required|string|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|unique:users',
            'gender' => 'nullable|string',
            'cin' => 'required|string|unique:users',
            'date_of_birth' => 'required|date',
            'address' => 'required|string',
            'permanent_address' => 'nullable|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'nullable|string',
            'role' => 'required|in:admin,subadmin,storekeeper,driver',
            'profile_picture' => 'nullable|image|max:2048',
            'is_driver' => 'boolean',
            'driver_license_number' => 'nullable|string',
            'vehicle_type' => 'nullable|string',
            'vehicle_registration' => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        $user = User::create($validated);
        return response()->json($user, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user, Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'username' => 'sometimes|string|unique:users,username,' . $id,
            'password' => 'sometimes|string|min:8',
            'phone' => 'sometimes|string|unique:users,phone,' . $id,
            'gender' => 'nullable|string',
            'cin' => 'sometimes|string|unique:users,cin,' . $id,
            'date_of_birth' => 'sometimes|date',
            'address' => 'sometimes|string',
            'permanent_address' => 'nullable|string',
            'city' => 'sometimes|string',
            'country' => 'sometimes|string',
            'postal_code' => 'nullable|string',
            'role' => 'sometimes|in:admin,subadmin,storekeeper,driver',
            'profile_picture' => 'nullable|image|max:2048',
            'is_driver' => 'boolean',
            'driver_license_number' => 'nullable|string',
            'vehicle_type' => 'nullable|string',
            'vehicle_registration' => 'nullable|string',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function changePassword(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $validator = Validator::make($request->all(), [
                'old_password' => 'required|string|min:8',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            if (!Hash::check($request->old_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            JWTAuth::manager()->invalidate(new \Tymon\JWTAuth\Token(JWTAuth::getToken()), true);
            $newToken = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully',
                'token' => $newToken
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Password change failed'
            ], 401);
        }
    }
}
