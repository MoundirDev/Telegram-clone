import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

/**
 * Custom hook for authentication (mock data — no backend)
 */
export const useAuth = () => {
  const store = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      store.setLoading(true);
      store.setError(null);

      const response = await apiClient.login(email, password);
      const { token, user } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      apiClient.setToken(token);
      store.setAuth(user, token);

      return { success: true, user };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      store.setLoading(true);
      store.setError(null);

      const response = await apiClient.register(
        username,
        email,
        password,
        confirmPassword
      );
      const { token, user } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      apiClient.setToken(token);
      store.setAuth(user, token);

      return { success: true, user };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      apiClient.clearToken();
      store.logout();
    }
  };

  return {
    ...store,
    login,
    register,
    logout,
  };
};
