'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { IconTelegram } from '@/components/ui/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      router.push('/');
    } else {
      setLocalError(result.error ?? 'Registration failed');
    }
  };

  return (
    <div className="min-h-dvh tg-chat-wallpaper flex items-center justify-center p-4 bg-tg-panel">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <IconTelegram className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-tg-title">Create your account</h1>
          <p className="text-tg-muted text-[15px] mt-2">Join and start messaging</p>
        </div>

        <div className="bg-tg-sidebar rounded-2xl shadow-lg border border-tg-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                {error || localError}
              </div>
            )}

            {(['username', 'email', 'password', 'confirmPassword'] as const).map(field => (
              <div key={field}>
                <label className="block text-[13px] font-medium text-tg-muted mb-1.5 ml-1 capitalize">
                  {field === 'confirmPassword' ? 'Confirm password' : field}
                </label>
                <input
                  type={
                    field.includes('password')
                      ? 'password'
                      : field === 'email'
                        ? 'email'
                        : 'text'
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full bg-tg-search-bg border-0 rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-tg-blue/40"
                  disabled={isLoading}
                />
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="tg-btn-primary w-full py-3">
              {isLoading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="text-center text-[14px] text-tg-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-tg-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
