<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareAdminData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->is_admin && $request->is('admin/*')) {
            Inertia::share([
                'stats' => function () {
                    return [
                        'total_users' => \App\Models\User::count(),
                        'active_users' => \App\Models\User::where('is_active', true)->count(),
                        'pending_transactions' => \App\Models\Transaction::where('status', 'pending')->count(),
                        'pending_kyc' => \App\Models\UserKyc::where('verification_status', 'pending')->count(),
                    ];
                },
            ]);
        }

        return $next($request);
    }
}
