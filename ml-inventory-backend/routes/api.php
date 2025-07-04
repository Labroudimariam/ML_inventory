<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Beneficiary;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\IsAuthenticated;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\InventoriesController;
use App\Http\Controllers\BeneficiariesController;
use App\Http\Controllers\DeliveryController; 

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->get('/profile', function (Request $request) {
    return response()->json([
        'message' => 'Here is your profile',
        'user' => $request->user()
    ]);
});

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Protected routes for all authenticated users
Route::middleware([IsAuthenticated::class])->group(function () {

    // Users
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    // Change Password
    Route::put('/user/change-password', [UserController::class, 'changePassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

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
    Route::put('inboxes/{id}/mark-as-read', [InboxController::class, 'markAsRead']);
    Route::delete('inboxes/{id}', [InboxController::class, 'destroy']);
    Route::put('/inboxes/{id}/toggle-important', [InboxController::class, 'toggleImportant']);

    // Warehouses
    Route::get('/warehouses', [WarehouseController::class, 'index']);
    Route::post('/warehouses', [WarehouseController::class, 'store']);
    Route::get('/warehouses/{id}', [WarehouseController::class, 'show']);
    Route::put('/warehouses/{id}', [WarehouseController::class, 'update']);
    Route::delete('/warehouses/{id}', [WarehouseController::class, 'destroy']);

    // Deliveries
    Route::get('/deliveries', [DeliveryController::class, 'index']);
    Route::post('/deliveries', [DeliveryController::class, 'store']);
    Route::get('/deliveries/{id}', [DeliveryController::class, 'show']);
    Route::put('/deliveries/{id}', [DeliveryController::class, 'update']);
    Route::patch('/deliveries/{id}', [DeliveryController::class, 'update']);
    Route::delete('/deliveries/{id}', [DeliveryController::class, 'destroy']);
    Route::post('/deliveries/{id}/validate', [DeliveryController::class, 'validateDelivery']);
    Route::get('/deliveries/{id}/track', [DeliveryController::class, 'track']);
});

Route::middleware([IsAuthenticated::class])->get('/dashboard-stats', function () {
    $now = Carbon::now();
    $startOfThisWeek = $now->copy()->startOfWeek();
    $endOfThisWeek = $now->copy()->endOfWeek();
    $startOfLastWeek = $now->copy()->subWeek()->startOfWeek();
    $endOfLastWeek = $now->copy()->subWeek()->endOfWeek();

    return response()->json([
        // TOTALS
        'total_products' => Product::count(),
        'total_categories' => Category::count(),
        'total_beneficiaries' => Beneficiary::count(),
        'total_orders' => Order::count(),
        'total_deliveries' => \App\Models\Delivery::count(),

        // WEEKLY COMPARISONS
        'current_week_products' => Product::whereBetween('created_at', [$startOfThisWeek, $endOfThisWeek])->count(),
        'previous_week_products' => Product::whereBetween('created_at', [$startOfLastWeek, $endOfLastWeek])->count(),

        'current_week_categories' => Category::whereBetween('created_at', [$startOfThisWeek, $endOfThisWeek])->count(),
        'previous_week_categories' => Category::whereBetween('created_at', [$startOfLastWeek, $endOfLastWeek])->count(),

        'current_week_beneficiaries' => Beneficiary::whereBetween('created_at', [$startOfThisWeek, $endOfThisWeek])->count(),
        'previous_week_beneficiaries' => Beneficiary::whereBetween('created_at', [$startOfLastWeek, $endOfLastWeek])->count(),

        'current_week_orders' => Order::whereBetween('created_at', [$startOfThisWeek, $endOfThisWeek])->count(),
        'previous_week_orders' => Order::whereBetween('created_at', [$startOfLastWeek, $endOfLastWeek])->count(),

        'current_week_deliveries' => \App\Models\Delivery::whereBetween('created_at', [$startOfThisWeek, $endOfThisWeek])->count(),
        'previous_week_deliveries' => \App\Models\Delivery::whereBetween('created_at', [$startOfLastWeek, $endOfLastWeek])->count(),
    ]);
});