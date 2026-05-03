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
exports.TransaccionesController = void 0;
const common_1 = require("@nestjs/common");
const transacciones_service_1 = require("./transacciones.service");
const create_transaccion_dto_1 = require("./dto/create-transaccion.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TransaccionesController = class TransaccionesController {
    constructor(transaccionesService) {
        this.transaccionesService = transaccionesService;
    }
    create(req, createTransaccionDto) {
        return this.transaccionesService.create(req.user.userId, createTransaccionDto);
    }
    findAll(req, mes, año, tipo) {
        return this.transaccionesService.findAll(req.user.userId, {
            mes: mes ? parseInt(mes) : undefined,
            año: año ? parseInt(año) : undefined,
            tipo,
        });
    }
    getResumen(req, mes, año) {
        return this.transaccionesService.getResumen(req.user.userId, mes ? parseInt(mes) : undefined, año ? parseInt(año) : undefined);
    }
    findOne(req, id) {
        return this.transaccionesService.findOne(req.user.userId, parseInt(id));
    }
    update(req, id, updateTransaccionDto) {
        return this.transaccionesService.update(req.user.userId, parseInt(id), updateTransaccionDto);
    }
    remove(req, id) {
        return this.transaccionesService.remove(req.user.userId, parseInt(id));
    }
};
exports.TransaccionesController = TransaccionesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaccion_dto_1.CreateTransaccionDto]),
    __metadata("design:returntype", void 0)
], TransaccionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('mes')),
    __param(2, (0, common_1.Query)('año')),
    __param(3, (0, common_1.Query)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], TransaccionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('mes')),
    __param(2, (0, common_1.Query)('año')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TransaccionesController.prototype, "getResumen", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransaccionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], TransaccionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransaccionesController.prototype, "remove", null);
exports.TransaccionesController = TransaccionesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('transacciones'),
    __metadata("design:paramtypes", [transacciones_service_1.TransaccionesService])
], TransaccionesController);
//# sourceMappingURL=transacciones.controller.js.map