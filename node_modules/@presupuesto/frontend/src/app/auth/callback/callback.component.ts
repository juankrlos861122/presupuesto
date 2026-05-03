import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2> Procesando...</h2>
        <p class="subtitle">Iniciando sesión con Google</p>
      </div>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const userStr = this.route.snapshot.queryParamMap.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        this.auth.login(token, user);
        this.router.navigate(['/dashboard']);
      } catch (e) {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}