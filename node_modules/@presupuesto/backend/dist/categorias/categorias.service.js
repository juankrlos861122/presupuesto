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
exports.CategoriasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriasService = class CategoriasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createCategoriaDto) {
        return this.prisma.categoria.create({
            data: {
                userId,
                nombre: createCategoriaDto.nombre,
                icono: createCategoriaDto.icono || '💰',
                tipo: createCategoriaDto.tipo,
                esPersonalizada: true,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.categoria.findMany({
            where: {
                OR: [{ userId }, { userId: null }],
            },
            orderBy: [{ tipo: 'asc' }, { nombre: 'asc' }],
        });
    }
    async findByTipo(userId, tipo) {
        return this.prisma.categoria.findMany({
            where: {
                OR: [{ userId }, { userId: null }],
                tipo,
            },
            orderBy: { nombre: 'asc' },
        });
    }
    async findOne(userId, id) {
        const categoria = await this.prisma.categoria.findFirst({
            where: { id, OR: [{ userId }, { userId: null }] },
        });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        return categoria;
    }
    async update(userId, id, updateCategoriaDto) {
        const categoria = await this.findOne(userId, id);
        if (!categoria.esPersonalizada) {
            throw new common_1.NotFoundException('No se puede modificar una categoría predeterminada');
        }
        return this.prisma.categoria.update({
            where: { id },
            data: updateCategoriaDto,
        });
    }
    async remove(userId, id) {
        const categoria = await this.findOne(userId, id);
        if (!categoria.esPersonalizada) {
            throw new common_1.NotFoundException('No se puede eliminar una categoría predeterminada');
        }
        const transaccionesCount = await this.prisma.transaccion.count({
            where: { categoriaId: id },
        });
        if (transaccionesCount > 0) {
            throw new common_1.NotFoundException('No se puede eliminar una categoría con transacciones asociadas');
        }
        await this.prisma.categoria.delete({ where: { id } });
        return { message: 'Categoría eliminada correctamente' };
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriasService);
//# sourceMappingURL=categorias.service.js.map