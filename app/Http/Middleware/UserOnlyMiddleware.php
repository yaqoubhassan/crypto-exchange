<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserOnlyMiddleware
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    // Check if user is authenticated and is an admin
    if (auth()->check() && auth()->user()->is_admin) {
      // Redirect admin to admin dashboard instead of user routes
      return redirect()->route('admin.dashboard')
        ->with('info', 'Admins should use the admin panel. Redirected to admin dashboard.');
    }

    return $next($request);
  }
}
