<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false) . '?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));

            // Update last login timestamp and IP address
            $request->user()->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);

            // Send welcome email after successful verification
            try {
                Mail::to($request->user()->email)->send(new WelcomeMail($request->user()));
            } catch (\Exception $e) {
                // Log the error but don't fail the verification process
                Log::error('Failed to send welcome email', [
                    'user_id' => $request->user()->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return redirect()->intended(route('dashboard', absolute: false) . '?verified=1');
    }
}
