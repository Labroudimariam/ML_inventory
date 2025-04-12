<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
{
    if (!$request->user()) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }

    if ($request->user()->role !== $role) {
        return response()->json([
            'error' => 'Forbidden',
            'required_role' => $role,
            'user_role' => $request->user()->role
        ], 403);
    }

    return $next($request);
}
    }

