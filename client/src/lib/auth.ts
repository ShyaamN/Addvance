// Simple authentication system for admin users
// In production, this should use proper OAuth and server-side authentication

interface AdminUser {
  username: string;
  role: 'admin';
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Addv@ncemaths123!',
};

class AuthManager {
  private storageKey = 'auth_admin';

  login(username: string, password: string): boolean {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user: AdminUser = { username, role: 'admin' };
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
