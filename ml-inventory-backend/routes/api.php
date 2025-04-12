<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BeneficiariesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\InventoriesController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\InboxController;
use App\Http\Middleware\IsAuthenticated;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware([IsAuthenticated::class])->get('/profile', function (Request $request) {
    return response()->json([
        'message' => 'Here is your profile',
        'user' => $request->user()
    ]);
});

// Protected routes for all authenticated users
Route::middleware([IsAuthenticated::class])->group(function () {

    // Products
    Route::get('products', [ProductController::class, 'index']);
    Route::post('products', [ProductController::class, 'store']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);

    // Beneficiaries
    Route::get('beneficiaries', [BeneficiariesController::class, 'index']);
    Route::post('beneficiaries', [BeneficiariesController::class, 'store']);
    Route::get('beneficiaries/{id}', [BeneficiariesController::class, 'show']);
    Route::put('beneficiaries/{id}', [BeneficiariesController::class, 'update']);
    Route::delete('beneficiaries/{id}', [BeneficiariesController::class, 'destroy']);

    // Orders
    Route::get('orders', [OrdersController::class, 'index']);
    Route::post('orders', [OrdersController::class, 'store']);
    Route::get('orders/{id}', [OrdersController::class, 'show']);
    Route::put('orders/{id}', [OrdersController::class, 'update']);
    Route::delete('orders/{id}', [OrdersController::class, 'destroy']);

    // Order Items
    Route::get('order-items', [OrderItemsController::class, 'index']);
    Route::post('order-items', [OrderItemsController::class, 'store']);
    Route::get('order-items/{id}', [OrderItemsController::class, 'show']);
    Route::put('order-items/{id}', [OrderItemsController::class, 'update']);
    Route::delete('order-items/{id}', [OrderItemsController::class, 'destroy']);

    // Inventory
    Route::get('inventory', [InventoriesController::class, 'index']);
    Route::post('inventory', [InventoriesController::class, 'store']);
    Route::get('inventory/{id}', [InventoriesController::class, 'show']);
    Route::put('inventory/{id}', [InventoriesController::class, 'update']);
    Route::delete('inventory/{id}', [InventoriesController::class, 'destroy']);

    // Reports
    Route::get('reports', [ReportsController::class, 'index']);
    Route::post('reports', [ReportsController::class, 'store']);
    Route::get('reports/{id}', [ReportsController::class, 'show']);
    Route::put('reports/{id}', [ReportsController::class, 'update']);
    Route::delete('reports/{id}', [ReportsController::class, 'destroy']);

    // Inboxes
    Route::get('inboxes', [InboxController::class, 'index']);
    Route::post('inboxes', [InboxController::class, 'store']);
    Route::get('inboxes/{id}', [InboxController::class, 'show']);
    Route::put('inboxes/{id}', [InboxController::class, 'update']);
    Route::delete('inboxes/{id}', [InboxController::class, 'destroy']);
});
