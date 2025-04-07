<?php


namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Vérifier si l'utilisateur est authentifié via Sanctum
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}