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
exports.AhorrosController = void 0;
const common_1 = require("@nestjs/common");
const ahorros_service_1 = require("./ahorros.service");
const create_ahorro_dto_1 = require("./dto/create-ahorro.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AhorrosController = class AhorrosController {
    constructor(ahorrosService) {
        this.ahorrosService = ahorrosService;
    }
    create(req, createAhorroDto) {
        return this.ahorrosService.create(req.user.userId, createAhorroDto);
    }
    findAll(req) {
        return this.ahorrosService.findAll(req.user.userId);
    }
    getResumen(req) {
        return this.ahorrosService.getResumen(req.user.userId);
    }
    findOne(req, id) {
        return this.ahorrosService.findOne(req.user.userId, parseInt(id));
    }
    update(req, id, updateAhorroDto) {
        return this.ahorrosService.update(req.user.userId, parseInt(id), updateAhorroDto);
    }
    depositar(req, id, body) {
        return this.ahorrosService.depositar(req.user.userId, parseInt(id), body.monto, body.fecha);
    }
    getHistorial(req, id) {
        return this.ahorrosService.getHistorial(req.user.userId, parseInt(id));
    }
    remove(req, id) {
        return this.ahorrosService.remove(req.user.userId, parseInt(id));
    }
};
exports.AhorrosController = AhorrosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_ahorro_dto_1.CreateAhorroDto]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "getResumen", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/depositar'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "depositar", null);
__decorate([
    (0, common_1.Get)(':id/historial'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "getHistorial", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AhorrosController.prototype, "remove", null);
exports.AhorrosController = AhorrosController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ahorros'),
    __metadata("design:paramtypes", [ahorros_service_1.AhorrosService])
], AhorrosController);
//# sourceMappingURL=ahorros.controller.js.map