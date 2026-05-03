import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'presupuesto_token';
  private userKey = 'presupuesto_user';

  constructor(private router: Router) {}

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get user(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  login(token: string, user: User) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }
}