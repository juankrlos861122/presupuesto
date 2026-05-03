"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEstadisticas(userId) {
        const now = new Date();
        const mesActual = now.getMonth() + 1;
        const añoActual = now.getFullYear();
        const startOfMonth = new Date(añoActual, mesActual - 1, 1, 0, 0, 0);
        const endOfMonth = new Date(añoActual, mesActual, 0, 23, 59, 59, 999);
        const transaccionesMes = await this.prisma.transaccion.findMany({
            where: {
                userId,
                fecha: { gte: startOfMonth, lte: endOfMonth },
            },
        });
        const totalIngresos = transaccionesMes
            .filter(t => t.tipo === 'ingreso')
            .reduce((sum, t) => sum + t.monto, 0);
        const totalGastos = transaccionesMes
            .filter(t => t.tipo === 'gasto')
            .reduce((sum, t) => sum + t.monto, 0);
        const savings = await this.prisma.ahorro.findMany({ where: { userId } });
        const totalAhorrado = savings.reduce((sum, s) => sum + s.montoActual, 0);
        const totalObjetivoAhorros = savings.reduce((sum, s) => sum + s.montoObjetivo, 0);
        const objetivos = await this.prisma.objetivo.findMany({
            where: { userId, completado: false },
        });
        const totalObjetivos = objetivos.reduce((sum, o) => sum + o.montoObjetivo, 0);
        const totalActualObjetivos = objetivos.reduce((sum, o) => sum + o.montoActual, 0);
        const ultimosMeses = [];
        for (let i = 5; i >= 0; i--) {
            const fecha = new Date(añoActual, mesActual - 1 - i, 1);
            const mes = fecha.getMonth() + 1;
            const año = fecha.getFullYear();
            const startDate = new Date(año, mes - 1, 1);
            const endDate = new Date(año, mes, 0);
            const transacciones = await this.prisma.transaccion.findMany({
                where: {
                    userId,
                    fecha: { gte: startDate, lte: endDate },
                },
            });
            const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
            const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
            ultimosMeses.push({ mes, año, ingresos, gastos });
        }
        const limiteGastos = totalIngresos * 0.9;
        const porcentajeUsado = totalGastos > 0 && limiteGastos > 0 ? (totalGastos / limiteGastos) * 100 : 0;
        return {
            mesActual: { mes: mesActual, año: añoActual },
            ingresos: {
                total: totalIngresos,
                porcentaje: totalIngresos > 0 ? 100 : 0,
            },
            gastos: {
                total: totalGastos,
                porcentaje: Math.min(porcentajeUsado, 100),
                limite: limiteGastos,
                excedido: totalGastos > limiteGastos,
            },
            balance: totalIngresos - totalGastos,
            porcentajeAhorro: totalIngresos > 0 ? ((totalIngresos - totalGastos) / totalIngresos) * 100 : 0,
            ahorros: {
                total: totalAhorrado,
                objetivo: totalObjetivoAhorros,
                porcentaje: totalObjetivoAhorros > 0 ? (totalAhorrado / totalObjetivoAhorros) * 100 : 0,
            },
            objetivos: {
                total: totalActualObjetivos,
                objetivo: totalObjetivos,
                porcentaje: totalObjetivos > 0 ? (totalActualObjetivos / totalObjetivos) * 100 : 0,
                cantidad: objetivos.length,
            },
            ultimosMeses,
        };
    }
    async getGraficos(userId, año) {
        const year = año || new Date().getFullYear();
        const resultados = [];
        for (let mes = 1; mes <= 12; mes++) {
            const startDate = new Date(year, mes - 1, 1);
            const endDate = new Date(year, mes, 0);
            const transacciones = await this.prisma.transaccion.findMany({
                where: {
                    userId,
                    fecha: { gte: startDate, lte: endDate },
                },
            });
            const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
            const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
            resultados.push({ mes, ingresos, gastos, balance: ingresos - gastos });
        }
        return resultados;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map