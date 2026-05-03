import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ahorros',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="header">
      <div class="header-content">
        <h1>Ahorros</h1>
        <div class="flex items-center gap-4">
          <nav class="nav">
            <a routerLink="/dashboard">Dashboard</a>
            <a routerLink="/transacciones">Transacciones</a>
            <a routerLink="/ahorros" class="active">Ahorros</a>
            <a routerLink="/objetivos">Objetivos</a>
            <a routerLink="/categorias">Categorías</a>
          </nav>
          <button class="btn btn-secondary" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="card mb-4">
        <div class="flex flex-between items-center mb-4">
          <h3>Mis Ahorros</h3>
          <button class="btn btn-primary" (click)="openModal()">+ Nuevo Ahorro</button>
        </div>

        <div class="grid grid-3">
          @for (a of ahorros; track a.id) {
            <div class="card" style="background: var(--background)">
              <h4 class="mb-2">{{ a.nombre }}</h4>
              <div class="mb-2">
                <div class="text-success" style="font-size: 24px; font-weight: 700">{{ formatCurrency(a.montoActual) }}</div>
                <div class="text-muted">de {{ formatCurrency(a.montoObjetivo) }}</div>
              </div>
              <div class="progress-bar mb-2">
                <div class="fill success" [style.width.%]="(a.montoActual / a.montoObjetivo) * 100"></div>
              </div>
              <div class="flex flex-between text-muted mb-2">
                <span>{{ ((a.montoActual / a.montoObjetivo) * 100).toFixed(1) }}%</span>
                <span>Vence: {{ a.fechaObjetivo | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="mb-2">
                <div class="flex flex-between mb-1">
                  <span class="text-muted" style="font-size: 12px">Tiempo restante</span>
                  <span class="text-muted" style="font-size: 12px" [class.text-danger]="getDiasRestantes(a) <= 30">{{ getDiasRestantes(a) }} días</span>
                </div>
                <div class="progress-bar" style="height: 6px">
                  <div class="fill" [class.danger]="getDiasRestantes(a) <= 30" [class.warning]="getDiasRestantes(a) > 30 && getDiasRestantes(a) <= 60" [style.width.%]="getTiempoRestantePorcentaje(a)"></div>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-primary" style="flex: 1" (click)="openDepositarModal(a)">Depositar</button>
                <button class="btn btn-secondary" (click)="editAhorro(a)">✏️</button>
                <button class="btn btn-secondary" (click)="openHistorialModal(a)">📋</button>
                <button class="btn btn-danger" (click)="deleteAhorro(a.id)">🗑️</button>
              </div>
            </div>
          } @empty {
            <div class="text-center text-muted" style="grid-column: 1/-1">No hay ahorros</div>
          }
        </div>
      </div>

      <div class="card">
        <h3 class="mb-3">Resumen Total</h3>
        <div class="grid grid-3">
          <div class="stat-card">
            <div class="label">Total Ahorrado</div>
            <div class="value text-success">{{ formatCurrency(resumen?.totalAhorrado || 0) }}</div>
          </div>
          <div class="stat-card">
            <div class="label">Objetivo Total</div>
            <div class="value">{{ formatCurrency(resumen?.totalObjetivo || 0) }}</div>
          </div>
          <div class="stat-card">
            <div class="label">Porcentaje General</div>
            <div class="value text-primary">{{ (resumen?.porcentajeGeneral || 0).toFixed(1) }}%</div>
          </div>
        </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingId ? 'Editar' : 'Nuevo' }} Ahorro</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <form (ngSubmit)="saveAhorro()">
            @if (errorMessage) {
              <div class="alert alert-danger mb-3">{{ errorMessage }}</div>
            }
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" class="form-control" [(ngModel)]="ahorro.nombre" name="nombre" required>
            </div>
            <div class="form-group">
              <label>Monto Objetivo</label>
              <input type="number" class="form-control" [(ngModel)]="ahorro.montoObjetivo" name="montoObjetivo" required min="0">
            </div>
            <div class="form-group">
              <label>Fecha Objetivo</label>
              <input type="date" class="form-control" [(ngModel)]="ahorro.fechaObjetivo" name="fechaObjetivo" required>
            </div>
            <div class="actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (showDepositarModal) {
      <div class="modal-overlay" (click)="closeDepositarModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Depositar a {{ ahorroActual?.nombre }}</h3>
            <button class="modal-close" (click)="closeDepositarModal()">×</button>
          </div>
          <form (ngSubmit)="depositar()">
            <div class="form-group">
              <label>Monto a Depositar</label>
              <input type="number" class="form-control" [(ngModel)]="montoDeposito" name="monto" required min="0">
            </div>
            <div class="form-group">
              <label>Fecha del Depósito</label>
              <input type="date" class="form-control" [(ngModel)]="fechaDeposito" name="fecha" required>
            </div>
            <div class="actions">
              <button type="button" class="btn btn-secondary" (click)="closeDepositarModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Depositar</button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (showHistorialModal) {
      <div class="modal-overlay" (click)="closeHistorialModal()">
        <div class="modal" (click)="$event.stopPropagation()" style="max-height: 80vh; overflow-y: auto">
          <div class="modal-header">
            <h3>Historial de {{ historialItem?.nombre }}</h3>
            <button class="modal-close" (click)="closeHistorialModal()">×</button>
          </div>
          <div style="padding: 16px">
            @for (h of historialData; track h.id) {
              <div class="historial-item">
                <span class="text-success">+{{ formatCurrency(h.monto) }}</span>
                <span class="text-muted">{{ h.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            } @empty {
              <div class="text-muted text-center" style="padding: 20px">Sin depósitos</div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AhorrosComponent implements OnInit {
  ahorros: any[] = [];
  resumen: any;
  showModal = false;
  showDepositarModal = false;
  showHistorialModal = false;
  editingId: number | null = null;
  ahorroActual: any = null;
  montoDeposito = 0;
  fechaDeposito = new Date().toISOString().split('T')[0];
  errorMessage = '';
  historialData: any[] = [];
  historialItem: any = null;

  ahorro = { nombre: '', montoObjetivo: 0, fechaObjetivo: '' };

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.loadData();
  }

  loadData() {
    this.api.getAhorros().subscribe((data) => (this.ahorros = data));
    this.api.getResumenAhorros().subscribe((data) => (this.resumen = data));
  }

  openModal() {
    this.errorMessage = '';
    this.ahorro = { nombre: '', montoObjetivo: 0, fechaObjetivo: '' };
    this.editingId = null;
    this.showModal = true;
  }

  editAhorro(a: any) {
    this.errorMessage = '';
    this.ahorro = {
      nombre: a.nombre,
      montoObjetivo: a.montoObjetivo,
      fechaObjetivo: new Date(a.fechaObjetivo).toISOString().split('T')[0],
    };
    this.editingId = a.id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.errorMessage = '';
    this.editingId = null;
  }

  openDepositarModal(a: any) {
    this.ahorroActual = a;
    this.montoDeposito = 0;
    this.fechaDeposito = new Date().toISOString().split('T')[0];
    this.showDepositarModal = true;
  }

  closeDepositarModal() {
    this.showDepositarModal = false;
    this.ahorroActual = null;
  }

  openHistorialModal(a: any) {
    this.historialItem = a;
    this.historialData = [];
    this.showHistorialModal = true;
    this.api.getHistorialAhorros(a.id).subscribe(data => {
      this.historialData = data;
    });
  }

  closeHistorialModal() {
    this.showHistorialModal = false;
    this.historialItem = null;
    this.historialData = [];
  }

  saveAhorro() {
    this.errorMessage = '';
    if (this.editingId) {
      this.api.updateAhorro(this.editingId, this.ahorro).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al guardar el ahorro';
        }
      });
    } else {
      this.api.createAhorro(this.ahorro).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al crear el ahorro';
        }
      });
    }
  }

  deleteAhorro(id: number) {
    if (confirm('¿Eliminar este ahorro?')) {
      this.api.deleteAhorro(id).subscribe(() => this.loadData());
    }
  }

  depositar() {
    if (this.ahorroActual && this.montoDeposito > 0) {
      this.api.depositarAhorro(this.ahorroActual.id, { monto: this.montoDeposito, fecha: this.fechaDeposito }).subscribe(() => {
        this.loadData();
        this.closeDepositarModal();
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }

  getDiasRestantes(ahorro: any): number {
    const fechaObjetivo = new Date(ahorro.fechaObjetivo);
    const ahora = new Date();
    const diff = fechaObjetivo.getTime() - ahora.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getTiempoRestantePorcentaje(ahorro: any): number {
    const fechaObjetivo = new Date(ahorro.fechaObjetivo);
    const ahora = new Date();
    const fechaInicio = ahorro.fechaInicio ? new Date(ahorro.fechaInicio) : new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const totalDias = Math.ceil((fechaObjetivo.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    const diasPasados = Math.ceil((ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    if (totalDias <= 0) return 100;
    return Math.max(0, Math.min(100, (diasPasados / totalDias) * 100));
  }

  logout() {
    this.auth.logout();
  }
}