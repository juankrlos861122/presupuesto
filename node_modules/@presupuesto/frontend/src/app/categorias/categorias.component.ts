import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="header">
      <div class="header-content">
        <h1>Categorías</h1>
        <div class="flex items-center gap-4">
          <nav class="nav">
            <a routerLink="/dashboard">Dashboard</a>
            <a routerLink="/transacciones">Transacciones</a>
            <a routerLink="/ahorros">Ahorros</a>
            <a routerLink="/objetivos">Objetivos</a>
            <a routerLink="/categorias" class="active">Categorías</a>
          </nav>
          <button class="btn btn-secondary" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="card mb-4">
        <div class="flex flex-between items-center mb-4">
          <h3>Gestionar Categorías</h3>
          <button class="btn btn-primary" (click)="openModal()">+ Nueva Categoría</button>
        </div>

        <div class="mb-4">
          <button class="btn" [class.btn-primary]="filtroTipo === ''" [class.btn-secondary]="filtroTipo !== ''" (click)="filtroTipo = ''; loadCategorias()">Todas</button>
          <button class="btn" [class.btn-primary]="filtroTipo === 'ingreso'" [class.btn-secondary]="filtroTipo !== 'ingreso'" (click)="filtroTipo = 'ingreso'; loadCategorias()">Ingresos</button>
          <button class="btn" [class.btn-primary]="filtroTipo === 'gasto'" [class.btn-secondary]="filtroTipo !== 'gasto'" (click)="filtroTipo = 'gasto'; loadCategorias()">Gastos</button>
        </div>

        <div class="grid grid-4">
          @for (c of categoriasFiltradas; track c.id) {
            <div class="card" style="background: var(--background); text-align: center">
              <div style="font-size: 32px; margin-bottom: 8px">{{ c.icono }}</div>
              <h4 class="mb-2">{{ c.nombre }}</h4>
              <span class="badge" [class.badge-ingreso]="c.tipo === 'ingreso'" [class.badge-gasto]="c.tipo === 'gasto'">{{ c.tipo }}</span>
              @if (c.esPersonalizada) {
                <div class="flex gap-2 mt-4" style="justify-content: center">
                  <button class="btn btn-secondary" style="padding: 4px 8px" (click)="editCategoria(c)">✏️</button>
                  <button class="btn btn-danger" style="padding: 4px 8px" (click)="deleteCategoria(c.id)">🗑️</button>
                </div>
              }
            </div>
          } @empty {
            <div class="text-center text-muted" style="grid-column: 1/-1">No hay categorías</div>
          }
        </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingId ? 'Editar' : 'Nueva' }} Categoría</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <form (ngSubmit)="saveCategoria()">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" class="form-control" [(ngModel)]="categoria.nombre" name="nombre" required>
            </div>
            <div class="form-group">
              <label>Tipo</label>
              <select class="select" [(ngModel)]="categoria.tipo" name="tipo" required>
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
              </select>
            </div>
            <div class="form-group">
              <label>Icono (emoji)</label>
              <input type="text" class="form-control" [(ngModel)]="categoria.icono" name="icono" maxlength="2">
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
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  categoriasFiltradas: any[] = [];
  showModal = false;
  editingId: number | null = null;
  filtroTipo = '';

  categoria = { nombre: '', tipo: 'gasto' as const, icono: '💰' };

  iconos = ['💰', '💵', '💳', '🏠', '🚗', '🍔', '🛒', '🎮', '🏥', '📚', '👕', '✈️', '🎁', '💡', '📱', '💻'];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.loadCategorias();
  }

  loadCategorias() {
    this.api.getCategorias().subscribe((data) => {
      this.categorias = data;
      this.categoriasFiltradas = this.filtroTipo ? data.filter((c: any) => c.tipo === this.filtroTipo) : data;
    });
  }

  openModal() {
    this.categoria = { nombre: '', tipo: 'gasto', icono: '💰' };
    this.editingId = null;
    this.showModal = true;
  }

  editCategoria(c: any) {
    this.categoria = {
      nombre: c.nombre,
      tipo: c.tipo,
      icono: c.icono,
    };
    this.editingId = c.id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  saveCategoria() {
    if (this.editingId) {
      this.api.updateCategoria(this.editingId, this.categoria).subscribe(() => {
        this.loadCategorias();
        this.closeModal();
      });
    } else {
      this.api.createCategoria(this.categoria).subscribe(() => {
        this.loadCategorias();
        this.closeModal();
      });
    }
  }

  deleteCategoria(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.api.deleteCategoria(id).subscribe(() => this.loadCategorias());
    }
  }

  logout() {
    this.auth.logout();
  }
}