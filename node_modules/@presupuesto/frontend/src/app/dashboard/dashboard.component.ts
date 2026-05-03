import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="header">
      <div class="header-content">
        <h1>Dashboard - {{ user?.name }}</h1>
        <div class="flex items-center gap-4">
          <nav class="nav">
            <a routerLink="/dashboard" class="active">Dashboard</a>
            <a routerLink="/transacciones">Transacciones</a>
            <a routerLink="/ahorros">Ahorros</a>
            <a routerLink="/objetivos">Objetivos</a>
            <a routerLink="/categorias">Categorías</a>
          </nav>
          <button class="btn btn-secondary" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>

    <div class="container">
      @if (alertas.length > 0) {
        <div class="card mb-4">
          <h3 class="mb-3">Alertas</h3>
          @for (alerta of alertas; track alerta.tipo) {
            <div class="flex items-center gap-2 mb-2" [class.text-danger]="alerta.urgencia === 'alta'" [class.text-warning]="alerta.urgencia === 'media'">
              <span>⚠️</span>
              <span>{{ alerta.mensaje }}</span>
            </div>
          }
        </div>
      }

      <div class="grid grid-4 mb-4">
        <div class="card stat-card">
          <div class="label">Ingresos del Mes</div>
          <div class="value text-success">{{ formatCurrency(estadisticas?.ingresos?.total || 0) }}</div>
        </div>
        <div class="card stat-card">
          <div class="label">Gastos del Mes</div>
          <div class="value text-danger">{{ formatCurrency(estadisticas?.gastos?.total || 0) }}</div>
        </div>
        <div class="card stat-card">
          <div class="label">Balance</div>
          <div class="value" [class.text-success]="(estadisticas?.balance || 0) >= 0" [class.text-danger]="(estadisticas?.balance || 0) < 0">
            {{ formatCurrency(estadisticas?.balance || 0) }}
          </div>
        </div>
        <div class="card stat-card">
          <div class="label">Ahorro</div>
          <div class="value text-primary">{{ (estadisticas?.porcentajeAhorro || 0).toFixed(1) }}%</div>
        </div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <h3 class="mb-3">Progreso de Ahorros</h3>
          <div class="mb-3">
            <div class="flex flex-between mb-1">
              <span>Ahorrado</span>
              <span>{{ formatCurrency(estadisticas?.ahorros?.total || 0) }} / {{ formatCurrency(estadisticas?.ahorros?.objetivo || 0) }}</span>
            </div>
            <div class="progress-bar">
              <div class="fill success" [style.width.%]="estadisticas?.ahorros?.porcentaje || 0"></div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="mb-3">Límite de Gastos (90% de ingresos)</h3>
          <div class="mb-3">
            <div class="flex flex-between mb-1">
              <span>Usado</span>
              <span>{{ formatCurrency(estadisticas?.gastos?.total || 0) }} / {{ formatCurrency(estadisticas?.gastos?.limite || 0) }}</span>
            </div>
            <div class="progress-bar">
              <div class="fill" [class.danger]="(estadisticas?.gastos?.porcentaje || 0) > 90" [style.width.%]="estadisticas?.gastos?.porcentaje || 0"></div>
            </div>
          </div>
          <div class="flex flex-between mb-2">
            <span class="text-muted">Disponible:</span>
            <span [class.text-success]="disponible > 0" [class.text-danger]="disponible <= 0">
              {{ formatCurrency(disponible) }}
            </span>
          </div>
          @if (estadisticas?.gastos?.excedido) {
            <div class="text-danger">¡Has excedido tu límite de gastos!</div>
          }
        </div>
      </div>

      <div class="grid grid-2 mb-4">
        <div class="card">
          <h3 class="mb-3">Objetivos Activos</h3>
          <div class="mb-3">
            <div class="flex flex-between mb-1">
              <span>Total</span>
              <span>{{ formatCurrency(estadisticas?.objetivos?.total || 0) }} / {{ formatCurrency(estadisticas?.objetivos?.objetivo || 0) }}</span>
            </div>
            <div class="progress-bar">
              <div class="fill" [style.width.%]="estadisticas?.objetivos?.porcentaje || 0"></div>
            </div>
          </div>
          <p class="text-muted">{{ estadisticas?.objetivos?.cantidad || 0 }} objetivos activos</p>
        </div>

        <div class="card">
          <h3 class="mb-3">Exportar Reporte</h3>
          <div class="flex gap-2">
            <button class="btn btn-primary" (click)="downloadPDF()">📄 PDF</button>
            <button class="btn btn-secondary" (click)="downloadExcel()">📊 Excel</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="mb-3">Evolución Financiera (Últimos 6 meses)</h3>
        <div class="chart-container">
          <canvas #chartCanvas></canvas>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  user: any;
  estadisticas: any;
  alertas: any[] = [];
  chart: any;

  get disponible(): number {
    const limite = this.estadisticas?.gastos?.limite || 0;
    const gastado = this.estadisticas?.gastos?.total || 0;
    return limite - gastado;
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.user;
    if (!this.auth.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.loadData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initChart(), 500);
  }

  loadData() {
    this.api.getEstadisticas().subscribe((data) => {
      this.estadisticas = data;
    });

    this.api.getAlertas().subscribe((data) => {
      this.alertas = data;
    });
  }

  initChart() {
    if (!this.estadisticas?.ultimosMeses || !this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const meses = this.estadisticas.ultimosMeses.map((m: any) => this.getMonthName(m.mes));
    const ingresos = this.estadisticas.ultimosMeses.map((m: any) => m.ingresos);
    const gastos = this.estadisticas.ultimosMeses.map((m: any) => m.gastos);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          { label: 'Ingresos', data: ingresos, backgroundColor: '#10b981' },
          { label: 'Gastos', data: gastos, backgroundColor: '#ef4444' },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  getMonthName(month: number): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[month - 1];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }

  downloadPDF() {
    this.api.exportPDF().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presupuesto.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadExcel() {
    this.api.exportExcel().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presupuesto.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  logout() {
    this.auth.logout();
  }
}