import { Routes } from '@angular/router';
import { CallbackComponent } from './auth/callback/callback.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'auth/callback', 
    component: CallbackComponent
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'transacciones', 
    loadComponent: () => import('./transacciones/transacciones.component').then(m => m.TransaccionesComponent)
  },
  { 
    path: 'ahorros', 
    loadComponent: () => import('./ahorros/ahorros.component').then(m => m.AhorrosComponent)
  },
  { 
    path: 'objetivos', 
    loadComponent: () => import('./objetivos/objetivos.component').then(m => m.ObjetivosComponent)
  },
  { 
    path: 'categorias', 
    loadComponent: () => import('./categorias/categorias.component').then(m => m.CategoriasComponent)
  },
];