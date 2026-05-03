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
exports.TransaccionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransaccionesService = class TransaccionesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getIngresosMesActual(userId) {
        const now = new Date();
        const mesActual = now.getMonth() + 1;
        const añoActual = now.getFullYear();
        const startDate = new Date(añoActual, mesActual - 1, 1);
        const endDate = new Date(añoActual, mesActual, 0, 23, 59, 59);
        const transacciones = await this.prisma.transaccion.findMany({
            where: {
                userId,
                tipo: 'ingreso',
                fecha: { gte: startDate, lte: endDate },
            },
        });
        return transacciones.reduce((sum, t) => sum + t.monto, 0);
    }
    async getGastosMesActual(userId) {
        const now = new Date();
        const mesActual = now.getMonth() + 1;
        const añoActual = now.getFullYear();
        const startDate = new Date(añoActual, mesActual - 1, 1);
        const endDate = new Date(añoActual, mesActual, 0, 23, 59, 59);
        const transacciones = await this.prisma.transaccion.findMany({
            where: {
                userId,
                tipo: 'gasto',
                fecha: { gte: startDate, lte: endDate },
            },
        });
        return transacciones.reduce((sum, t) => sum + t.monto, 0);
    }
    async create(userId, createTransaccionDto) {
        const fechaTransaccion = createTransaccionDto.fecha ? new Date(createTransaccionDto.fecha + 'T12:00:00') : new Date();
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        if (fechaTransaccion > now) {
            throw new common_1.BadRequestException('La fecha no puede ser mayor a la fecha actual');
        }
        if (createTransaccionDto.tipo === 'gasto') {
            const ingresos = await this.getIngresosMesActual(userId);
            const gastos = await this.getGastosMesActual(userId);
            const nuevoGasto = gastos + createTransaccionDto.monto;
            if (nuevoGasto > ingresos) {
                throw new common_1.BadRequestException('Los gastos del mes no pueden superar los ingresos mensuales');
            }
        }
        return this.prisma.transaccion.create({
            data: {
                userId,
                tipo: createTransaccionDto.tipo,
                categoriaId: createTransaccionDto.categoriaId,
                monto: createTransaccionDto.monto,
                descripcion: createTransaccionDto.descripcion,
                fecha: createTransaccionDto.fecha ? new Date(createTransaccionDto.fecha + 'T12:00:00') : new Date(),
            },
            include: { categoria: true },
        });
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters?.mes && filters?.año) {
            const startDate = new Date(filters.año, filters.mes - 1, 1);
            const endDate = new Date(filters.año, filters.mes, 0);
            where.fecha = { gte: startDate, lte: endDate };
        }
        if (filters?.tipo) {
            where.tipo = filters.tipo;
        }
        return this.prisma.transaccion.findMany({
            where,
            include: { categoria: true },
            orderBy: { fecha: 'desc' },
        });
    }
    async findOne(userId, id) {
        const transaccion = await this.prisma.transaccion.findFirst({
            where: { id, userId },
            include: { categoria: true },
        });
        if (!transaccion) {
            throw new common_1.NotFoundException('Transacción no encontrada');
        }
        return transaccion;
    }
    async update(userId, id, updateTransaccionDto) {
        await this.findOne(userId, id);
        if (updateTransaccionDto.fecha) {
            const fechaTransaccion = new Date(updateTransaccionDto.fecha + 'T12:00:00');
            const now = new Date();
            now.setHours(23, 59, 59, 999);
            if (fechaTransaccion > now) {
                throw new common_1.BadRequestException('La fecha no puede ser mayor a la fecha actual');
            }
        }
        return this.prisma.transaccion.update({
            where: { id },
            data: {
                ...updateTransaccionDto,
                fecha: updateTransaccionDto.fecha ? new Date(updateTransaccionDto.fecha + 'T12:00:00') : undefined,
            },
            include: { categoria: true },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        await this.prisma.transaccion.delete({ where: { id } });
        return { message: 'Transacción eliminada correctamente' };
    }
    async getResumen(userId, mes, año) {
        const now = new Date();
        const month = mes || now.getMonth() + 1;
        const year = año || now.getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        const transacciones = await this.prisma.transaccion.findMany({
            where: {
                userId,
                fecha: { gte: startDate, lte: endDate },
            },
        });
        const ingresos = transacciones
            .filter(t => t.tipo === 'ingreso')
            .reduce((sum, t) => sum + t.monto, 0);
        const gastos = transacciones
            .filter(t => t.tipo === 'gasto')
            .reduce((sum, t) => sum + t.monto, 0);
        const gastosTransacciones = await this.prisma.transaccion.findMany({
            where: {
                userId,
                tipo: 'gasto',
                fecha: { gte: startDate, lte: endDate },
            },
            include: { categoria: { select: { nombre: true, icono: true } } },
        });
        const gastosAgrupados = gastosTransacciones.reduce((acc, t) => {
            const catId = t.categoriaId;
            if (!acc[catId]) {
                acc[catId] = {
                    categoriaId: catId,
                    nombre: t.categoria?.nombre,
                    icono: t.categoria?.icono,
                    total: 0,
                };
            }
            acc[catId].total += t.monto;
            return acc;
        }, {});
        return {
            mes: month,
            año: year,
            totalIngresos: ingresos,
            totalGastos: gastos,
            balance: ingresos - gastos,
            porcentajeAhorro: ingresos > 0 ? ((ingresos - gastos) / ingresos) * 100 : 0,
            gastosPorCategoria: Object.values(gastosAgrupados),
        };
    }
};
exports.TransaccionesService = TransaccionesService;
exports.TransaccionesService = TransaccionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransaccionesService);
//# sourceMappingURL=transacciones.service.js.map