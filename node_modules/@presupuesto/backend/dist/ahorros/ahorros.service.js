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
exports.AhorrosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AhorrosService = class AhorrosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createAhorroDto) {
        const fecha = new Date(createAhorroDto.fechaObjetivo + 'T12:00:00');
        const ahora = new Date();
        ahora.setHours(23, 59, 59, 999);
        if (fecha < ahora) {
            throw new common_1.BadRequestException('La fecha objetivo no puede ser menor a la fecha actual');
        }
        return this.prisma.ahorro.create({
            data: {
                userId,
                nombre: createAhorroDto.nombre,
                montoActual: createAhorroDto.montoActual || 0,
                montoObjetivo: createAhorroDto.montoObjetivo,
                fechaObjetivo: new Date(createAhorroDto.fechaObjetivo + 'T12:00:00'),
            },
        });
    }
    async findAll(userId) {
        return this.prisma.ahorro.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, id) {
        const ahorro = await this.prisma.ahorro.findFirst({
            where: { id, userId },
        });
        if (!ahorro) {
            throw new common_1.NotFoundException('Ahorro no encontrado');
        }
        return ahorro;
    }
    async update(userId, id, updateAhorroDto) {
        await this.findOne(userId, id);
        if (updateAhorroDto.fechaObjetivo) {
            const fecha = new Date(updateAhorroDto.fechaObjetivo + 'T12:00:00');
            const ahora = new Date();
            ahora.setHours(23, 59, 59, 999);
            if (fecha < ahora) {
                throw new common_1.BadRequestException('La fecha objetivo no puede ser menor a la fecha actual');
            }
        }
        return this.prisma.ahorro.update({
            where: { id },
            data: {
                ...updateAhorroDto,
                fechaObjetivo: updateAhorroDto.fechaObjetivo && updateAhorroDto.fechaObjetivo !== ''
                    ? new Date(updateAhorroDto.fechaObjetivo + 'T12:00:00')
                    : undefined,
            },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        await this.prisma.ahorro.delete({ where: { id } });
        return { message: 'Ahorro eliminado correctamente' };
    }
    async depositar(userId, id, monto, fecha) {
        const ahorro = await this.findOne(userId, id);
        await this.prisma.historialAporte.create({
            data: {
                ahorroId: id,
                monto: monto,
                descripcion: 'Depósito',
                fecha: fecha ? new Date(fecha + 'T12:00:00') : new Date(),
            },
        });
        return this.prisma.ahorro.update({
            where: { id },
            data: {
                montoActual: ahorro.montoActual + monto,
            },
        });
    }
    async getHistorial(userId, ahorroId) {
        await this.findOne(userId, ahorroId);
        return this.prisma.historialAporte.findMany({
            where: { ahorroId },
            orderBy: { fecha: 'desc' },
        });
    }
    async getResumen(userId) {
        const ahorros = await this.prisma.ahorro.findMany({ where: { userId } });
        const totalActual = ahorros.reduce((sum, a) => sum + a.montoActual, 0);
        const totalObjetivo = ahorros.reduce((sum, a) => sum + a.montoObjetivo, 0);
        return {
            totalAhorrado: totalActual,
            totalObjetivo: totalObjetivo,
            porcentajeGeneral: totalObjetivo > 0 ? (totalActual / totalObjetivo) * 100 : 0,
            cantidad: ahorros.length,
            ahorros,
        };
    }
};
exports.AhorrosService = AhorrosService;
exports.AhorrosService = AhorrosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AhorrosService);
//# sourceMappingURL=ahorros.service.js.map