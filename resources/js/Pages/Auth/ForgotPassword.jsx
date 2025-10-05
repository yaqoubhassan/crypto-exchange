import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
                <div className="w-full max-w-md">
                    {/* Card Container */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header with Icon */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Forgot Your Password?
                            </h2>
                            <p className="text-indigo-100 text-sm">
                                No worries, we'll help you reset it
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            Enter your email address and we'll send you a password reset link. Click the link in the email to create a new password.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Success Message */}
                            {status && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">
                                                {status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`block w-full pl-10 pr-3 py-3 border ${
                                                errors.email ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
                                            placeholder="you@example.com"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending reset link...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Send Reset Link
                                        </>
                                    )}
                                </button>

                                {/* Back to Login */}
                                <div className="text-center">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to login
                                    </Link>
                                </div>
                            </form>

                            {/* Steps Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                    How it works
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-semibold text-indigo-600">1</span>
                                        </div>
                                        <p className="ml-3 text-sm text-gray-600">
                                            Enter your email address
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-semibold text-indigo-600">2</span>
                                        </div>
                                        <p className="ml-3 text-sm text-gray-600">
                                            Check your inbox for the reset link
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-semibold text-indigo-600">3</span>
                                        </div>
                                        <p className="ml-3 text-sm text-gray-600">
                                            Click the link and create a new password
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-900">Didn't receive the email?</span>
                                            <br />
                                            Check your spam folder or{' '}
                                            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                                contact support
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Remember your password?{' '}
                            <Link 
                                href={route('login')} 
                                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500">
                            Password reset links expire after 60 minutes
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}