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
exports.NotificacionesController = void 0;
const common_1 = require("@nestjs/common");
const notificaciones_service_1 = require("./notificaciones.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NotificacionesController = class NotificacionesController {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }
    getAlertas(req) {
        return this.notificacionesService.getAlertas(req.user.userId);
    }
    getConfiguracion(req) {
        return this.notificacionesService.getConfiguracion(req.user.userId);
    }
    updateConfiguracion(req, config) {
        return this.notificacionesService.updateConfiguracion(req.user.userId, config);
    }
};
exports.NotificacionesController = NotificacionesController;
__decorate([
    (0, common_1.Get)('alertas'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "getAlertas", null);
__decorate([
    (0, common_1.Get)('configuracion'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "getConfiguracion", null);
__decorate([
    (0, common_1.Put)('configuracion'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "updateConfiguracion", null);
exports.NotificacionesController = NotificacionesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('notificaciones'),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], NotificacionesController);
//# sourceMappingURL=notificaciones.controller.js.map