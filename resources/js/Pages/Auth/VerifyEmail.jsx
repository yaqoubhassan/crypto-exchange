import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (status === 'verification-link-sent') {
            setCountdown(60);
        }
    }, [status]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
                <div className="w-full max-w-md">
                    {/* Card Container */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header with Icon */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Verify Your Email
                            </h2>
                            <p className="text-indigo-100 text-sm">
                                We've sent a verification link to your inbox
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Welcome Message */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Thanks for Signing Up!
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Before getting started, please verify your email address by clicking the link we sent you.
                                </p>
                            </div>

                            {/* Success Message */}
                            {status === 'verification-link-sent' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fade-in">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-green-800">
                                                Verification email sent!
                                            </p>
                                            <p className="text-xs text-green-700 mt-1">
                                                Check your inbox for the verification link.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-blue-800 mb-1">
                                            What to do next:
                                        </h4>
                                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                            <li>Check your email inbox</li>
                                            <li>Click the verification link</li>
                                            <li>Start trading cryptocurrencies!</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Resend Form */}
                            <form onSubmit={submit} className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={processing || countdown > 0}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : countdown > 0 ? (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Resend in {countdown}s
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Resend Verification Email
                                        </>
                                    )}
                                </button>

                                {/* Logout Link */}
                                <div className="text-center">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Log out
                                    </Link>
                                </div>
                            </form>

                            {/* Help Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Didn't receive the email?
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span>Check your spam or junk folder</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span>Make sure you entered the correct email</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span>Wait a few minutes and try resending</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Support */}
                            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Still having trouble?{' '}
                                            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                                Contact support
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 text-center space-y-2">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Secure verification process</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Verification links expire after 24 hours
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}