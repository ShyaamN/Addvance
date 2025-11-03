// Simple authentication system for admin users
// In production, this should use proper OAuth and server-side authentication

interface AdminUser {
  email: string;
  role: 'admin';
}

const ADMIN_CREDENTIALS = {
  email: 'admin',
  password: 'Addv@ncemaths123!',
};

class AuthManager {
  private storageKey = 'auth_admin';

  login(email: string, password: string): boolean {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const user: AdminUser = { email, role: 'admin' };
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getCurrentUser(): AdminUser | null {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored) as AdminUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const auth = new AuthManager();
