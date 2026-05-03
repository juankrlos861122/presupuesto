import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="header">
      <div class="header-content">
        <h1>Transacciones</h1>
        <div class="flex items-center gap-4">
          <nav class="nav">
            <a routerLink="/dashboard">Dashboard</a>
            <a routerLink="/transacciones" class="active">Transacciones</a>
            <a routerLink="/ahorros">Ahorros</a>
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
          <h3>Lista de Transacciones</h3>
          <button class="btn btn-primary" (click)="openModal()">+ Nueva Transacción</button>
        </div>

        <div class="flex gap-4 mb-4">
          <select class="select" style="width: auto" [(ngModel)]="filtroTipo" (change)="loadTransacciones()">
            <option value="">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
          <input type="month" class="form-control" style="width: auto" [(ngModel)]="filtroMes" (change)="loadTransacciones()">
        </div>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (t of transacciones; track t.id) {
              <tr>
                <td>{{ t.fecha | date:'dd/MM/yyyy' }}</td>
                <td><span class="badge" [class.badge-ingreso]="t.tipo === 'ingreso'" [class.badge-gasto]="t.tipo === 'gasto'">{{ t.tipo }}</span></td>
                <td>{{ t.categoria?.icono }} {{ t.categoria?.nombre }}</td>
                <td [class.text-success]="t.tipo === 'ingreso'" [class.text-danger]="t.tipo === 'gasto'">
                  {{ t.tipo === 'ingreso' ? '+' : '-' }}{{ formatCurrency(t.monto) }}
                </td>
                <td>{{ t.descripcion || '-' }}</td>
                <td>
                  <button class="btn btn-secondary" style="padding: 4px 8px" (click)="editTransaccion(t)">✏️</button>
                  <button class="btn btn-danger" style="padding: 4px 8px" (click)="deleteTransaccion(t.id)">🗑️</button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="text-center text-muted">No hay transacciones</td></tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card">
        <h3 class="mb-3">Resumen del Mes</h3>
        <div class="grid grid-3">
          <div class="stat-card">
            <div class="label">Total Ingresos</div>
            <div class="value text-success">{{ formatCurrency(resumen?.totalIngresos || 0) }}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Gastos</div>
            <div class="value text-danger">{{ formatCurrency(resumen?.totalGastos || 0) }}</div>
          </div>
          <div class="stat-card">
            <div class="label">Balance</div>
            <div class="value" [class.text-success]="(resumen?.balance || 0) >= 0" [class.text-danger]="(resumen?.balance || 0) < 0">
              {{ formatCurrency(resumen?.balance || 0) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingId ? 'Editar' : 'Nueva' }} Transacción</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <form (ngSubmit)="saveTransaccion()">
            @if (errorMessage) {
              <div class="alert alert-danger mb-3">{{ errorMessage }}</div>
            }
            <div class="form-group">
              <label>Tipo</label>
              <select class="select" [(ngModel)]="transaccion.tipo" name="tipo" required (change)="onTipoChange()">
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
              </select>
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select class="select" [(ngModel)]="transaccion.categoriaId" name="categoriaId" required>
                @for (c of filteredCategorias; track c.id) {
                  <option [value]="c.id">{{ c.icono }} {{ c.nombre }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Monto</label>
              <input type="number" class="form-control" [(ngModel)]="transaccion.monto" name="monto" required min="0" step="0.01">
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <input type="text" class="form-control" [(ngModel)]="transaccion.descripcion" name="descripcion">
            </div>
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" class="form-control" [(ngModel)]="transaccion.fecha" name="fecha">
            </div>
            <div class="actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class TransaccionesComponent implements OnInit {
  transacciones: any[] = [];
  categorias: any[] = [];
  resumen: any;
  showModal = false;
  editingId: number | null = null;
  filtroTipo = '';
  filtroMes = '';
  errorMessage = '';

  transaccion = {
    tipo: 'gasto',
    categoriaId: 0,
    monto: 0,
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
  };

  get filteredCategorias() {
    return this.categorias.filter(c => c.tipo === this.transaccion.tipo);
  }

  onTipoChange() {
    const cat = this.filteredCategorias[0];
    this.transaccion.categoriaId = cat?.id || 0;
  }

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
    this.loadCategorias();
    this.loadTransacciones();
    this.loadResumen();
  }

  loadCategorias() {
    this.api.getCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }

  loadTransacciones() {
    const filters: any = {};
    if (this.filtroTipo) filters.tipo = this.filtroTipo;
    if (this.filtroMes) {
      const [año, mes] = this.filtroMes.split('-');
      filters.año = año;
      filters.mes = mes;
    }
    this.api.getTransacciones(filters).subscribe((data) => {
      this.transacciones = data;
    });
  }

  loadResumen() {
    const [año, mes] = new Date().getFullYear().toString().split('-');
    this.api.getResumenTransacciones(new Date().getMonth() + 1, new Date().getFullYear()).subscribe((data) => {
      this.resumen = data;
    });
  }

  openModal() {
    this.errorMessage = '';
    this.transaccion = {
      tipo: 'gasto',
      categoriaId: this.categorias.find(c => c.tipo === 'gasto')?.id || 0,
      monto: 0,
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
    };
    this.editingId = null;
    this.showModal = true;
  }

  editTransaccion(t: any) {
    this.errorMessage = '';
    this.transaccion = {
      tipo: t.tipo,
      categoriaId: t.categoriaId,
      monto: t.monto,
      descripcion: t.descripcion || '',
      fecha: new Date(t.fecha).toISOString().split('T')[0],
    };
    this.editingId = t.id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
    this.errorMessage = '';
  }

  saveTransaccion() {
    this.errorMessage = '';
    if (this.editingId) {
      this.api.updateTransaccion(this.editingId, this.transaccion).subscribe({
        next: () => {
          this.loadTransacciones();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al guardar la transacción';
        }
      });
    } else {
      this.api.createTransaccion(this.transaccion).subscribe({
        next: () => {
          this.loadTransacciones();
          this.loadResumen();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al guardar la transacción';
        }
      });
    }
  }

  deleteTransaccion(id: number) {
    if (confirm('¿Eliminar esta transacción?')) {
      this.api.deleteTransaccion(id).subscribe(() => {
        this.loadTransacciones();
        this.loadResumen();
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }

  logout() {
    this.auth.logout();
  }
}