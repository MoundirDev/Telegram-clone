'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateUserProfile } from '@/hooks/useApi';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { IconBack, IconTelegram } from '@/components/ui/Icons';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { logout } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateUserProfile();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user) {
      setUsername(user.username);
      setBio(user.bio || '');
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    const formData = new FormData();
    if (username) formData.append('username', username);
    if (bio) formData.append('bio', bio);
    if (avatar) formData.append('avatar', avatar);

    updateProfile(formData, {
      onSuccess: () => {
        setMessage('Profile updated');
        setAvatar(null);
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (err: unknown) => {
        setMessage(err instanceof Error ? err.message : 'Update failed');
      },
    });
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-tg-panel">
        <div className="w-10 h-10 border-2 border-tg-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-tg-panel flex flex-col">
      <header className="bg-tg-sidebar border-b border-tg-border px-3 py-2 flex items-center gap-2 shadow-header sticky top-0 z-10">
        <Link href="/" className="tg-btn-icon text-tg-blue">
          <IconBack />
        </Link>
        <h1 className="text-[17px] font-semibold text-tg-title">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto tg-scrollbar">
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <section className="bg-tg-sidebar rounded-2xl border border-tg-border p-5 shadow-sm">
            <h2 className="text-[13px] font-semibold text-tg-muted uppercase tracking-wide mb-3">
              Appearance
            </h2>
            <ThemeToggle />
          </section>

          <section className="bg-tg-sidebar rounded-2xl border border-tg-border p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-tg-border"
                />
              ) : (
                <Avatar name={user?.username ?? 'U'} size="lg" />
              )}
              <label className="mt-3 text-tg-blue text-[15px] cursor-pointer hover:underline">
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {message && (
              <div className="mb-4 px-4 py-2 rounded-xl bg-tg-outgoing text-tg-outgoing-text text-[14px] text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[13px] text-tg-muted ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="mt-1 w-full tg-search-input rounded-xl"
                />
              </div>
              <div>
                <label className="text-[13px] text-tg-muted ml-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={150}
                  rows={3}
                  className="mt-1 w-full tg-search-input rounded-xl resize-none"
                />
                <p className="text-xs text-tg-muted mt-1 text-right">{bio.length}/150</p>
              </div>
              <button type="submit" disabled={isPending} className="tg-btn-primary w-full">
                {isPending ? 'Saving…' : 'Save profile'}
              </button>
            </form>
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
          >
            Log out
          </button>

          <p className="text-center text-tg-muted text-xs flex items-center justify-center gap-1 pb-6">
            <IconTelegram className="w-4 h-4" /> Telegram Clone — mock data
          </p>
        </div>
      </div>
    </div>
  );
}
