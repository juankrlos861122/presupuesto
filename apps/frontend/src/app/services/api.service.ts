import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const API_URL = "https://presupuesto-backend-39io.onrender.com";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Auth
  register(data: {
    email: string;
    password: string;
    name: string;
  }): Observable<any> {
    return this.http.post(`${API_URL}/auth/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${API_URL}/auth/login`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${API_URL}/auth/profile`);
  }

  // Dashboard
  getEstadisticas(): Observable<any> {
    return this.http.get(`${API_URL}/dashboard/estadisticas`);
  }

  getGraficos(año?: number): Observable<any> {
    return this.http.get(`${API_URL}/dashboard/graficos`, {
      params: año ? { año: año.toString() } : {},
    });
  }

  // Transacciones
  getTransacciones(filters?: any): Observable<any> {
    return this.http.get(`${API_URL}/transacciones`, { params: filters || {} });
  }

  getResumenTransacciones(mes?: number, año?: number): Observable<any> {
    const params: any = {};
    if (mes) params.mes = mes.toString();
    if (año) params.año = año.toString();
    return this.http.get(`${API_URL}/transacciones/resumen`, { params });
  }

  createTransaccion(data: any): Observable<any> {
    return this.http.post(`${API_URL}/transacciones`, data);
  }

  updateTransaccion(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/transacciones/${id}`, data);
  }

  deleteTransaccion(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/transacciones/${id}`);
  }

  // Ahorros
  getAhorros(): Observable<any> {
    return this.http.get(`${API_URL}/ahorros`);
  }

  getResumenAhorros(): Observable<any> {
    return this.http.get(`${API_URL}/ahorros/resumen`);
  }

  createAhorro(data: any): Observable<any> {
    return this.http.post(`${API_URL}/ahorros`, data);
  }

  updateAhorro(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/ahorros/${id}`, data);
  }

  deleteAhorro(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/ahorros/${id}`);
  }

  depositarAhorro(
    id: number,
    data: { monto: number; fecha?: string },
  ): Observable<any> {
    return this.http.put(`${API_URL}/ahorros/${id}/depositar`, data);
  }

  getHistorialAhorros(id: number): Observable<any> {
    return this.http.get(`${API_URL}/ahorros/${id}/historial`);
  }

  // Objetivos
  getObjetivos(): Observable<any> {
    return this.http.get(`${API_URL}/objetivos`);
  }

  getProgresoObjetivos(): Observable<any> {
    return this.http.get(`${API_URL}/objetivos/progreso`);
  }

  getAlertasObjetivos(): Observable<any> {
    return this.http.get(`${API_URL}/objetivos/alertas`);
  }

  createObjetivo(data: any): Observable<any> {
    return this.http.post(`${API_URL}/objetivos`, data);
  }

  updateObjetivo(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/objetivos/${id}`, data);
  }

  deleteObjetivo(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/objetivos/${id}`);
  }

  getHistorialObjetivos(id: number): Observable<any> {
    return this.http.get(`${API_URL}/objetivos/${id}/historial`);
  }

  // Categorías
  getCategorias(): Observable<any> {
    return this.http.get(`${API_URL}/categorias`);
  }

  getCategoriasByTipo(tipo: string): Observable<any> {
    return this.http.get(`${API_URL}/categorias/tipo/${tipo}`);
  }

  createCategoria(data: any): Observable<any> {
    return this.http.post(`${API_URL}/categorias`, data);
  }

  updateCategoria(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/categorias/${id}`, data);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/categorias/${id}`);
  }

  // Export
  exportPDF(mes?: number, año?: number): Observable<any> {
    const params: any = {};
    if (mes) params.mes = mes.toString();
    if (año) params.año = año.toString();
    return this.http.get(`${API_URL}/export/pdf`, { params, responseType: "blob" });
  }

  exportExcel(mes?: number, año?: number): Observable<any> {
    const params: any = {};
    if (mes) params.mes = mes.toString();
    if (año) params.año = año.toString();
    return this.http.get(`${API_URL}/export/excel`, {
      params,
      responseType: "blob",
    });
  }

  // Notificaciones
  getAlertas(): Observable<any> {
    return this.http.get(`${API_URL}/notificaciones/alertas`);
  }

  getConfiguracion(): Observable<any> {
    return this.http.get(`${API_URL}/notificaciones/configuracion`);
  }

  updateConfiguracion(data: any): Observable<any> {
    return this.http.put(`${API_URL}/notificaciones/configuracion`, data);
  }
}
