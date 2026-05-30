'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { IconCompose, IconSettings } from '@/components/ui/Icons';

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

export default function SidebarMenu({ open, onClose, onNewChat }: SidebarMenuProps) {
  const router = useRouter();
  const { logout } = useAuth();

  if (!open) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
    router.replace('/login');
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-tg-sidebar border-r border-tg-border shadow-2xl flex flex-col">
        <div className="p-4 border-b border-tg-border">
          <p className="text-lg font-semibold text-tg-title">Menu</p>
        </div>

        <ul className="flex-1 py-2">
          <li>
            <button
              type="button"
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-tg-title hover:bg-tg-hover"
            >
              <IconCompose className="text-tg-blue" />
              New message
            </button>
          </li>
          <li>
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-[15px] text-tg-title hover:bg-tg-hover"
            >
              <IconSettings className="text-tg-muted" />
              Settings
            </Link>
          </li>
        </ul>

        <div className="p-4 border-t border-tg-border space-y-4">
          <div>
            <p className="text-[13px] text-tg-muted mb-2">Appearance</p>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 text-[15px] font-medium"
          >
            Log out
          </button>
        </div>
      </nav>
    </>
  );
}
