<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\IsAuthenticated;

// Route publique d'enregistrement
Route::post('/register', [AuthController::class, 'register']);

// Route publique de connexion
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes protégées avec le middleware 'IsAuthenticated'
Route::middleware([IsAuthenticated::class])->get('/profile', function (Request $request) {
    return response()->json([
        'message' => 'Here is your profile',
        'user' => $request->user()
    ]);
});

// Route protégée avec le middleware 'CheckRole' pour les administrateurs
Route::middleware([IsAuthenticated::class, 'role:admin'])->get('/admin-dashboard', function () {
    return response()->json([
        'message' => 'Welcome to the admin dashboard'
    ]);
});

// Route protégée avec 'CheckRole' pour les sous-administrateurs
Route::middleware([IsAuthenticated::class, 'role:subadmin'])->get('/subadmin-dashboard', function () {
    return response()->json([
        'message' => 'Welcome to the subadmin dashboard'
    ]);
});

// Route protégée avec 'CheckRole' pour les magasiniers
Route::middleware([IsAuthenticated::class, 'role:storekeeper'])->get('/storekeeper-dashboard', function () {
    return response()->json([
        'message' => 'Welcome to the storekeeper dashboard'
    ]);
});

// Route protégée avec 'CheckRole' pour un utilisateur spécifique
Route::middleware([IsAuthenticated::class, 'role:user'])->get('/user-dashboard', function () {
    return response()->json([
        'message' => 'Welcome to your user dashboard'
    ]);
});
