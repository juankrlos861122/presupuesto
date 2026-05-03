import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-objetivos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="header">
      <div class="header-content">
        <h1>Objetivos Financieros</h1>
        <div class="flex items-center gap-4">
          <nav class="nav">
            <a routerLink="/dashboard">Dashboard</a>
            <a routerLink="/transacciones">Transacciones</a>
            <a routerLink="/ahorros">Ahorros</a>
            <a routerLink="/objetivos" class="active">Objetivos</a>
            <a routerLink="/categorias">Categorías</a>
          </nav>
          <button class="btn btn-secondary" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="card mb-4">
        <div class="flex flex-between items-center mb-4">
          <h3>Mis Objetivos</h3>
          <button class="btn btn-primary" (click)="openModal()">+ Nuevo Objetivo</button>
        </div>

        <div class="grid grid-3">
          @for (o of objetivos; track o.id) {
            <div class="card" style="background: var(--background)">
            <div class="flex flex-between items-center mb-2">
              <h4>{{ o.nombre }}</h4>
              @if (o.completado) {
                <span class="badge" style="background: #dcfce7; color: #166534">✓ Completado</span>
              }
            </div>
            <div class="mb-2">
              <div class="text-success" style="font-size: 24px; font-weight: 700">{{ formatCurrency(o.montoActual) }}</div>
              <div class="text-muted">de {{ formatCurrency(o.montoObjetivo) }}</div>
            </div>
            <div class="progress-bar mb-2">
              <div class="fill" [class.success]="o.completado" [style.width.%]="(o.montoActual / o.montoObjetivo) * 100"></div>
            </div>
            <div class="flex flex-between text-muted mb-2">
              <span>{{ ((o.montoActual / o.montoObjetivo) * 100).toFixed(1) }}%</span>
              <span>Vence: {{ o.fechaLimite | date:'dd/MM/yyyy' }}</span>
            </div>
            @if (!o.completado) {
              <div class="mb-2">
                <div class="flex flex-between mb-1">
                  <span class="text-muted" style="font-size: 12px">Tiempo restante</span>
                  <span class="text-muted" style="font-size: 12px" [class.text-danger]="getDiasRestantes(o) <= 30">{{ getDiasRestantes(o) }} días</span>
                </div>
                <div class="progress-bar" style="height: 6px">
                  <div class="fill" [class.danger]="getDiasRestantes(o) <= 30" [class.warning]="getDiasRestantes(o) > 30 && getDiasRestantes(o) <= 60" [style.width.%]="getTiempoRestantePorcentaje(o)"></div>
                </div>
              </div>
            }
            <div class="flex gap-2">
              <button class="btn btn-primary" style="flex: 1" (click)="openAportarModal(o)">Aportar</button>
              <button class="btn btn-secondary" (click)="editObjetivo(o)">✏️</button>
              <button class="btn btn-secondary" (click)="openHistorialModal(o)">📋</button>
              <button class="btn btn-danger" (click)="deleteObjetivo(o.id)">🗑️</button>
            </div>
          </div>
        } @empty {
            <div class="text-center text-muted" style="grid-column: 1/-1">No hay objetivos</div>
          }
        </div>
      </div>

      <div class="card">
        <h3 class="mb-3">Resumen de Objetivos</h3>
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="label">Total Objetivos</div>
            <div class="value">{{ progreso?.total || 0 }}</div>
          </div>
          <div class="stat-card">
            <div class="label">Activos</div>
            <div class="value text-warning">{{ progreso?.activos || 0 }}</div>
          </div>
          <div class="stat-card">
            <div class="label">Completados</div>
            <div class="value text-success">{{ progreso?.completados || 0 }}</div>
          </div>
          <div class="stat-card">
            <div class="label">Progreso General</div>
            <div class="value text-primary">{{ (progreso?.porcentajeGeneral || 0).toFixed(1) }}%</div>
          </div>
        </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingId ? 'Editar' : 'Nuevo' }} Objetivo</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <form (ngSubmit)="saveObjetivo()">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" class="form-control" [(ngModel)]="objetivo.nombre" name="nombre" required>
            </div>
            <div class="form-group">
              <label>Monto Objetivo</label>
              <input type="number" class="form-control" [(ngModel)]="objetivo.montoObjetivo" name="montoObjetivo" required min="0">
            </div>
            <div class="form-group">
              <label>Fecha Límite</label>
              <input type="date" class="form-control" [(ngModel)]="objetivo.fechaLimite" name="fechaLimite" required>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="objetivo.notificaciones" name="notificaciones"> Notificaciones
              </label>
            </div>
            <div class="actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (showAportarModal) {
      <div class="modal-overlay" (click)="closeAportarModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Aportar a {{ objetivoActual?.nombre }}</h3>
            <button class="modal-close" (click)="closeAportarModal()">×</button>
          </div>
          <form (ngSubmit)="aportar()">
            <div class="form-group">
              <label>Monto a Aportar</label>
              <input type="number" class="form-control" [(ngModel)]="montoAportar" name="monto" required min="0">
            </div>
            <div class="form-group">
              <label>Fecha del Aporte</label>
              <input type="date" class="form-control" [(ngModel)]="fechaAportar" name="fecha" required>
            </div>
            <div class="actions">
              <button type="button" class="btn btn-secondary" (click)="closeAportarModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Aportar</button>
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
              <div class="text-muted text-center" style="padding: 20px">Sin aportes</div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class ObjetivosComponent implements OnInit {
  objetivos: any[] = [];
  progreso: any;
  showModal = false;
  showAportarModal = false;
  showHistorialModal = false;
  editingId: number | null = null;
  objetivoActual: any = null;
  montoAportar = 0;
  fechaAportar = new Date().toISOString().split('T')[0];
  historialData: any[] = [];
  historialItem: any = null;

  objetivo = { nombre: '', montoObjetivo: 0, fechaLimite: '', notificaciones: true };

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
    this.api.getObjetivos().subscribe((data) => (this.objetivos = data));
    this.api.getProgresoObjetivos().subscribe((data) => (this.progreso = data));
  }

  openModal() {
    this.objetivo = { nombre: '', montoObjetivo: 0, fechaLimite: '', notificaciones: true };
    this.editingId = null;
    this.showModal = true;
  }

  editObjetivo(o: any) {
    this.objetivo = {
      nombre: o.nombre,
      montoObjetivo: o.montoObjetivo,
      fechaLimite: new Date(o.fechaLimite).toISOString().split('T')[0],
      notificaciones: o.notificaciones,
    };
    this.editingId = o.id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  openAportarModal(o: any) {
    this.objetivoActual = o;
    this.montoAportar = 0;
    this.fechaAportar = new Date().toISOString().split('T')[0];
    this.showAportarModal = true;
  }

  closeAportarModal() {
    this.showAportarModal = false;
    this.objetivoActual = null;
  }

  openHistorialModal(o: any) {
    this.historialItem = o;
    this.historialData = [];
    this.showHistorialModal = true;
    this.api.getHistorialObjetivos(o.id).subscribe(data => {
      this.historialData = data;
    });
  }

  closeHistorialModal() {
    this.showHistorialModal = false;
    this.historialItem = null;
    this.historialData = [];
  }

  saveObjetivo() {
    if (this.editingId) {
      this.api.updateObjetivo(this.editingId, this.objetivo).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.api.createObjetivo(this.objetivo).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  deleteObjetivo(id: number) {
    if (confirm('¿Eliminar este objetivo?')) {
      this.api.deleteObjetivo(id).subscribe(() => this.loadData());
    }
  }

  aportar() {
    if (this.objetivoActual && this.montoAportar > 0) {
      const nuevoMonto = this.objetivoActual.montoActual + this.montoAportar;
      this.api.updateObjetivo(this.objetivoActual.id, { montoActual: nuevoMonto, fechaAporte: this.fechaAportar }).subscribe(() => {
        this.loadData();
        this.closeAportarModal();
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }

  getDiasRestantes(objetivo: any): number {
    const fechaLimite = new Date(objetivo.fechaLimite);
    const ahora = new Date();
    const diff = fechaLimite.getTime() - ahora.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getTiempoRestantePorcentaje(objetivo: any): number {
    const fechaLimite = new Date(objetivo.fechaLimite);
    const ahora = new Date();
    const fechaCreacion = objetivo.createdAt ? new Date(objetivo.createdAt) : new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const totalDias = Math.ceil((fechaLimite.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
    const diasPasados = Math.ceil((ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
    
    if (totalDias <= 0) return 100;
    return Math.max(0, Math.min(100, (diasPasados / totalDias) * 100));
  }

  logout() {
    this.auth.logout();
  }
}