import { Redirect } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

/**
 * Protected route wrapper
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect />;
  }

  return <>{children}</>;
}
