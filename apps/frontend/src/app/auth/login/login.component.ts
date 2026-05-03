import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

declare const grecaptcha: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Presupuesto Personal</h2>
        <p class="subtitle">Gestiona tus finanzas fácilmente</p>
        
        <div class="tabs">
          <button [class.active]="activeTab === 'login'" (click)="activeTab = 'login'">Iniciar Sesión</button>
          <button [class.active]="activeTab === 'register'" (click)="activeTab = 'register'">Registrarse</button>
        </div>

        @if (error) {
          <div class="error">{{ error }}</div>
        }

        @if (activeTab === 'login') {
          <button class="btn btn-google" style="width: 100%; margin-bottom: 16px" (click)="googleLogin()">
            <img src="https://www.google.com/favicon.ico" alt="Google" style="width: 18px; height: 18px; margin-right: 8px">
            Iniciar sesión con Google
          </button>
          <div class="divider">
            <span>o</span>
          </div>
          <form (ngSubmit)="loginWithCaptcha()">
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" [(ngModel)]="loginData.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" class="form-control" [(ngModel)]="loginData.password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%" [disabled]="loading">
              {{ loading ? 'Verificando...' : 'Iniciar Sesión' }}
            </button>
          </form>
        } @else {
          <button class="btn btn-google" style="width: 100%; margin-bottom: 16px" (click)="googleLogin()">
            <img src="https://www.google.com/favicon.ico" alt="Google" style="width: 18px; height: 18px; margin-right: 8px">
            Registrarse con Google
          </button>
          <div class="divider">
            <span>o</span>
          </div>
          <form (ngSubmit)="registerWithCaptcha()">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" class="form-control" [(ngModel)]="registerData.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" [(ngModel)]="registerData.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" class="form-control" [(ngModel)]="registerData.password" name="password" required minlength="6">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%" [disabled]="loading">
              {{ loading ? 'Verificando...' : 'Crear Cuenta' }}
            </button>
          </form>
        }
      </div>
    </div>
  `,
})
export class LoginComponent implements AfterViewInit {
  activeTab: 'login' | 'register' = 'login';
  loading = false;
  error = '';

  loginData = { email: '', password: '', recaptchaToken: '' };
  registerData = { email: '', password: '', name: '', recaptchaToken: '' };

  private siteKey = '6LflrtYsAAAAAEC8R19MJRNXqvchZylGNbwSgRCZ';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    (window as any).__loginComponent = this;
  }

  private async getRecaptchaToken(): Promise<string> {
    if (typeof grecaptcha !== 'undefined' && grecaptcha) {
      try {
        return await grecaptcha.execute(this.siteKey, { action: 'login' });
      } catch {
        return '';
      }
    }
    return '';
  }

  async loginWithCaptcha() {
    const token = await this.getRecaptchaToken();
    this.loginData.recaptchaToken = token;
    this.login();
  }

  async registerWithCaptcha() {
    const token = await this.getRecaptchaToken();
    this.registerData.recaptchaToken = token;
    this.register();
  }

  login() {
    this.loading = true;
    this.error = '';
    this.api.login(this.loginData).subscribe({
      next: (res) => {
        this.auth.login(res.token, res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión';
        this.loading = false;
        this.loginData.recaptchaToken = '';
      },
    });
  }

  register() {
    this.loading = true;
    this.error = '';
    this.api.register(this.registerData).subscribe({
      next: (res) => {
        this.auth.login(res.token, res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse';
        this.loading = false;
        this.registerData.recaptchaToken = '';
      },
    });
  }

  googleLogin() {
    window.location.href = 'http://localhost:3001/auth/google';
  }
}