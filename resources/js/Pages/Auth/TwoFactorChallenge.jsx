import { useEffect, useRef, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';
import { Shield, Smartphone } from 'lucide-react';

export default function TwoFactorChallenge({ status }) {
  const [recovery, setRecovery] = useState(false);
  const codeInput = useRef();
  const recoveryCodeInput = useRef();

  const form = useForm({
    code: '',
  });

  useEffect(() => {
    if (recovery) {
      recoveryCodeInput.current?.focus();
    } else {
      codeInput.current?.focus();
    }
  }, [recovery]);

  const submit = (e) => {
    e.preventDefault();
    form.post(route('two-factor.login'), {
      onFinish: () => form.reset(),
    });
  };

  return (
    <GuestLayout>
      <Head title="Two-Factor Authentication" />

      <div className="mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Two-Factor Authentication
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {recovery
            ? 'Please enter one of your emergency recovery codes to continue.'
            : 'Please enter the 6-digit code from your authenticator app.'}
        </p>
      </div>

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        {!recovery ? (
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Authentication Code
            </label>
            <input
              id="code"
              ref={codeInput}
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={form.data.code}
              onChange={(e) => form.setData('code', e.target.value)}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="000000"
              autoComplete="one-time-code"
              required
            />
            <InputError message={form.errors.code} className="mt-2" />
            <div className="mt-3 flex items-center justify-center text-sm text-gray-500">
              <Smartphone className="w-4 h-4 mr-2" />
              <span>Open your authenticator app</span>
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="recovery_code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Recovery Code
            </label>
            <input
              id="recovery_code"
              ref={recoveryCodeInput}
              type="text"
              value={form.data.code}
              onChange={(e) => form.setData('code', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter recovery code"
              autoComplete="off"
              required
            />
            <InputError message={form.errors.code} className="mt-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setRecovery(!recovery);
              form.reset();
            }}
            className="text-sm text-indigo-600 hover:text-indigo-700 underline"
          >
            {recovery
              ? 'Use authentication code'
              : 'Use recovery code'}
          </button>

          <PrimaryButton disabled={form.processing}>
            {form.processing ? 'Verifying...' : 'Verify'}
          </PrimaryButton>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          Having trouble? Contact support or{' '}
          <a
            href={route('login')}
            className="text-indigo-600 hover:text-indigo-700 underline"
          >
            return to login
          </a>
        </p>
      </div>
    </GuestLayout>
  );
}