<?php

namespace App\Http\Controllers;

use App\Models\UserKyc;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserKycController extends Controller
{
    /**
     * Display KYC status or submission form
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $kyc = UserKyc::where('user_id', $user->id)->first();

        return Inertia::render('Profile/Kyc/Index', [
            'kyc' => $kyc,
            'hasSubmitted' => !is_null($kyc),
        ]);
    }

    /**
     * Store a new KYC submission
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Check if user already has a KYC submission
        $existingKyc = UserKyc::where('user_id', $user->id)->first();
        if ($existingKyc && $existingKyc->verification_status === 'pending') {
            return back()->with('error', 'You already have a pending KYC verification.');
        }

        if ($existingKyc && $existingKyc->verification_status === 'approved') {
            return back()->with('error', 'Your KYC is already verified.');
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'nationality' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'state_province' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'document_type' => 'required|in:passport,driver_license,national_id',
            'document_number' => 'required|string|max:255',
            'document_front_image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'document_back_image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'selfie_image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // Delete old KYC submission if rejected
        if ($existingKyc && $existingKyc->verification_status === 'rejected') {
            // Delete old images
            if ($existingKyc->document_front_image) {
                Storage::disk('public')->delete($existingKyc->document_front_image);
            }
            if ($existingKyc->document_back_image) {
                Storage::disk('public')->delete($existingKyc->document_back_image);
            }
            if ($existingKyc->selfie_image) {
                Storage::disk('public')->delete($existingKyc->selfie_image);
            }
            $existingKyc->delete();
        }

        // Handle file uploads
        $documentFrontPath = $request->file('document_front_image')->store('kyc/documents', 'public');
        $selfiePath = $request->file('selfie_image')->store('kyc/selfies', 'public');

        $documentBackPath = null;
        if ($request->hasFile('document_back_image')) {
            $documentBackPath = $request->file('document_back_image')->store('kyc/documents', 'public');
        }

        // Create KYC record
        $kyc = UserKyc::create([
            'user_id' => $user->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'date_of_birth' => $validated['date_of_birth'],
            'nationality' => $validated['nationality'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'state_province' => $validated['state_province'],
            'postal_code' => $validated['postal_code'],
            'country' => $validated['country'],
            'phone_number' => $validated['phone_number'],
            'document_type' => $validated['document_type'],
            'document_number' => $validated['document_number'],
            'document_front_image' => $documentFrontPath,
            'document_back_image' => $documentBackPath,
            'selfie_image' => $selfiePath,
            'verification_status' => 'pending',
        ]);

        // Update user's KYC status to pending
        $user->update([
            'kyc_status' => 'pending'
        ]);

        // Send confirmation notification to user
        NotificationService::send(
            user: $user,
            type: 'kyc_submitted',
            title: 'KYC Verification Submitted',
            message: 'Thank you for submitting your KYC documents! Our team will review your submission within 24-72 hours. You will receive a notification once the review is complete.',
            icon: '📋',
            link: '/profile/kyc',
            data: [
                'kyc_id' => $kyc->id,
                'submitted_at' => now()->toIso8601String(),
                'estimated_review_time' => '24-72 hours',
            ]
        );

        // Send notifications to all admins
        $this->notifyAdmins($user, $kyc);

        return redirect()->route('kyc.index')->with('success', 'KYC verification submitted successfully! We will review your documents within 24-72 hours. You will receive a notification once the review is complete.');
    }

    /**
     * Resubmit KYC after rejection
     */
    public function resubmit(Request $request)
    {
        return $this->store($request);
    }

    /**
     * Notify all admins of new KYC submission
     */
    private function notifyAdmins($user, $kyc)
    {
        // Get all admin users
        $admins = \App\Models\User::where('is_admin', true)->get();

        // Send notification to each admin
        foreach ($admins as $admin) {
            \App\Services\NotificationService::send(
                user: $admin,
                type: 'kyc_submission',
                title: 'New KYC Submission',
                message: "{$user->name} has submitted documents for KYC verification. Please review the submission.",
                icon: '🔍',
                link: '/admin/kyc',
                data: [
                    'kyc_id' => $kyc->id,
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'submitted_at' => now()->toIso8601String(),
                ]
            );
        }
    }
}
