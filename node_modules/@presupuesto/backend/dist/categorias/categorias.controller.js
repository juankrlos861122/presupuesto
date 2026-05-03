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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasController = void 0;
const common_1 = require("@nestjs/common");
const categorias_service_1 = require("./categorias.service");
const create_categoria_dto_1 = require("./dto/create-categoria.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CategoriasController = class CategoriasController {
    constructor(categoriasService) {
        this.categoriasService = categoriasService;
    }
    create(req, createCategoriaDto) {
        return this.categoriasService.create(req.user.userId, createCategoriaDto);
    }
    findAll(req) {
        return this.categoriasService.findAll(req.user.userId);
    }
    findByTipo(req, tipo) {
        return this.categoriasService.findByTipo(req.user.userId, tipo);
    }
    findOne(req, id) {
        return this.categoriasService.findOne(req.user.userId, parseInt(id));
    }
    update(req, id, updateCategoriaDto) {
        return this.categoriasService.update(req.user.userId, parseInt(id), updateCategoriaDto);
    }
    remove(req, id) {
        return this.categoriasService.remove(req.user.userId, parseInt(id));
    }
};
exports.CategoriasController = CategoriasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tipo/:tipo'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "remove", null);
exports.CategoriasController = CategoriasController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('categorias'),
    __metadata("design:paramtypes", [categorias_service_1.CategoriasService])
], CategoriasController);
//# sourceMappingURL=categorias.controller.js.map