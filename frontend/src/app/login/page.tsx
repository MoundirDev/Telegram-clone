'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/api';
import { IconTelegram } from '@/components/ui/Icons';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.push('/');
    } else {
      setLocalError(result.error ?? 'Login failed');
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };

  return (
    <div className="min-h-dvh tg-chat-wallpaper flex items-center justify-center p-4 bg-tg-panel relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="compact" />
      </div>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <IconTelegram className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-tg-title">Sign in to Telegram</h1>
          <p className="text-tg-muted text-[15px] mt-2">
            Welcome back. Please confirm your details.
          </p>
        </div>

        <div className="bg-tg-sidebar rounded-2xl shadow-lg border border-tg-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                {error || localError}
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium text-tg-muted mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-tg-search-bg border-0 rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-tg-blue/40"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-tg-muted mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-tg-search-bg border-0 rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-tg-blue/40"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button type="submit" disabled={isLoading} className="tg-btn-primary w-full py-3">
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-[14px] text-tg-muted mt-6">
            New here?{' '}
            <Link href="/register" className="text-tg-blue font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <button
          type="button"
          onClick={fillDemo}
          className="mt-4 w-full text-center text-[14px] text-tg-blue hover:underline"
        >
          Use demo account ({DEMO_EMAIL})
        </button>
      </div>
    </div>
  );
}
