"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjetivosModule = void 0;
const common_1 = require("@nestjs/common");
const objetivos_service_1 = require("./objetivos.service");
const objetivos_controller_1 = require("./objetivos.controller");
let ObjetivosModule = class ObjetivosModule {
};
exports.ObjetivosModule = ObjetivosModule;
exports.ObjetivosModule = ObjetivosModule = __decorate([
    (0, common_1.Module)({
        providers: [objetivos_service_1.ObjetivosService],
        controllers: [objetivos_controller_1.ObjetivosController],
        exports: [objetivos_service_1.ObjetivosService],
    })
], ObjetivosModule);
//# sourceMappingURL=objetivos.module.js.map