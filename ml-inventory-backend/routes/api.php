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

// Route publique d'enregistrement
Route::post('/register', [AuthController::class, 'register']);

// Route publique de connexion
Route::post('/login', [AuthController::class, 'login']);

// Route publique pour obtenir l'utilisateur authentifié
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Route protégée avec le middleware 'IsAuthenticated'
Route::middleware([IsAuthenticated::class])->get('/profile', function (Request $request) {
    return response()->json([
        'message' => 'Here is your profile',
        'user' => $request->user()
    ]);
});

// **Admin Routes** - CRUD for beneficiaries, products, orders, order items, inboxes; View inventory and reports

// Beneficiaries (Admin CRUD)
Route::middleware([IsAuthenticated::class, 'role:admin'])->group(function () {
    Route::get('beneficiaries', [BeneficiariesController::class, 'index']);
    Route::post('beneficiaries', [BeneficiariesController::class, 'store']);
    Route::get('beneficiaries/{id}', [BeneficiariesController::class, 'show']);
    Route::put('beneficiaries/{id}', [BeneficiariesController::class, 'update']);
    Route::delete('beneficiaries/{id}', [BeneficiariesController::class, 'destroy']);
});

// Products (Admin CRUD)
Route::middleware([IsAuthenticated::class, 'role:admin'])->group(function () {
    Route::get('products', [ProductController::class, 'index']);
    Route::post('products', [ProductController::class, 'store']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);
});

// Orders (Admin CRUD)
Route::middleware([IsAuthenticated::class, 'role:admin'])->group(function () {
    Route::get('orders', [OrdersController::class, 'index']);
    Route::post('orders', [OrdersController::class, 'store']);
    Route::get('orders/{id}', [OrdersController::class, 'show']);
    Route::put('orders/{id}', [OrdersController::class, 'update']);
    Route::delete('orders/{id}', [OrdersController::class, 'destroy']);
});

// Order Items (Admin CRUD)
Route::middleware([IsAuthenticated::class, 'role:admin'])->group(function () {
    Route::get('order-items', [OrderItemsController::class, 'index']);
    Route::post('order-items', [OrderItemsController::class, 'store']);
    Route::get('order-items/{id}', [OrderItemsController::class, 'show']);
    Route::put('order-items/{id}', [OrderItemsController::class, 'update']);
    Route::delete('order-items/{id}', [OrderItemsController::class, 'destroy']);
});

// Inboxes (Admin CRUD)
Route::middleware([IsAuthenticated::class, 'role:admin'])->group(function () {
    Route::get('inboxes', [InboxController::class, 'index']);
    Route::post('inboxes', [InboxController::class, 'store']);
    Route::get('inboxes/{id}', [InboxController::class, 'show']);
    Route::put('inboxes/{id}', [InboxController::class, 'update']);
    Route::delete('inboxes/{id}', [InboxController::class, 'destroy']);
});

// Inventory (Admin View Only)
Route::middleware([IsAuthenticated::class, 'role:admin'])->group(function () {
    Route::get('inventory', [InventoriesController::class, 'index']);
});

// Reports (Admin View Only)
Route::middleware([IsAuthenticated::class, 'role:admin'])->group(function () {
    Route::get('reports', [ReportsController::class, 'index']);
});

// **Subadmin Routes** - CRUD for products, orders, order items; View inventory and CRUD for reports

// Products (Subadmin CRUD)
Route::middleware([IsAuthenticated::class, 'role:subadmin'])->group(function () {
    Route::get('products', [ProductController::class, 'index']);
    Route::post('products', [ProductController::class, 'store']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);
});

// Orders (Subadmin CRUD)
Route::middleware([IsAuthenticated::class, 'role:subadmin'])->group(function () {
    Route::get('orders', [OrdersController::class, 'index']);
    Route::post('orders', [OrdersController::class, 'store']);
    Route::get('orders/{id}', [OrdersController::class, 'show']);
    Route::put('orders/{id}', [OrdersController::class, 'update']);
    Route::delete('orders/{id}', [OrdersController::class, 'destroy']);
});

// Order Items (Subadmin CRUD)
Route::middleware([IsAuthenticated::class, 'role:subadmin'])->group(function () {
    Route::get('order-items', [OrderItemsController::class, 'index']);
    Route::post('order-items', [OrderItemsController::class, 'store']);
    Route::get('order-items/{id}', [OrderItemsController::class, 'show']);
    Route::put('order-items/{id}', [OrderItemsController::class, 'update']);
    Route::delete('order-items/{id}', [OrderItemsController::class, 'destroy']);
});

// Inventory (Subadmin View Only)
Route::middleware([IsAuthenticated::class, 'role:subadmin'])->group(function () {
    Route::get('inventory', [InventoriesController::class, 'index']);
});

// Reports (Subadmin CRUD)
Route::middleware([IsAuthenticated::class, 'role:subadmin'])->group(function () {
    Route::get('reports', [ReportsController::class, 'index']);
    Route::post('reports', [ReportsController::class, 'store']);
    Route::get('reports/{id}', [ReportsController::class, 'show']);
    Route::put('reports/{id}', [ReportsController::class, 'update']);
    Route::delete('reports/{id}', [ReportsController::class, 'destroy']);
});

// **Storekeeper Routes** - CRUD for inventory and reports; View orders and order items and products


// Products (Storekeeper View Only)
Route::middleware([IsAuthenticated::class, 'role:storekeeper'])->group(function () {
    Route::get('products', [ProductController::class, 'index']);
});


// Orders (Storekeeper View Only)
Route::middleware([IsAuthenticated::class, 'role:storekeeper'])->group(function () {
    Route::get('orders', [OrdersController::class, 'index']);
});


// Order Items (Storekeeper View Only)
Route::middleware([IsAuthenticated::class, 'role:storekeeper'])->group(function () {
    Route::get('order-items', [OrderItemsController::class, 'index']);
});


// Inventory (Storekeeper CRUD)
Route::middleware([IsAuthenticated::class, 'role:storekeeper'])->group(function () {
    Route::get('inventory', [InventoriesController::class, 'index']);
    Route::post('inventory', [InventoriesController::class, 'store']);
    Route::get('inventory/{id}', [InventoriesController::class, 'show']);
    Route::put('inventory/{id}', [InventoriesController::class, 'update']);
    Route::delete('inventory/{id}', [InventoriesController::class, 'destroy']);
});


// Reports (Storekeeper CRUD)
Route::middleware([IsAuthenticated::class, 'role:storekeeper'])->group(function () {
    Route::get('reports', [ReportsController::class, 'index']);
    Route::post('reports', [ReportsController::class, 'store']);
    Route::get('reports/{id}', [ReportsController::class, 'show']);
    Route::put('reports/{id}', [ReportsController::class, 'update']);
    Route::delete('reports/{id}', [ReportsController::class, 'destroy']);
});


