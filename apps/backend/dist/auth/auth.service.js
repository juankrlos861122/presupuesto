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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const https = require("https");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async verifyRecaptcha(token) {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const postData = new URLSearchParams({
                secret: secretKey,
                response: token,
            }).toString();
            const options = {
                hostname: 'www.google.com',
                port: 443,
                path: '/recaptcha/api/siteverify',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData),
                },
            };
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(body);
                        console.log('[reCAPTCHA] Response:', result);
                        resolve(result.success || false);
                    }
                    catch (e) {
                        console.log('[reCAPTCHA] Parse error:', e);
                        resolve(false);
                    }
                });
            });
            req.on('error', (e) => {
                console.log('[reCAPTCHA] Request error:', e);
                resolve(false);
            });
            req.write(postData);
            req.end();
        });
    }
    async validateRecaptcha(token) {
        if (!token || token === '') {
            return;
        }
        const isValid = await this.verifyRecaptcha(token);
        if (!isValid) {
            throw new common_1.BadRequestException('Verificación de seguridad fallida');
        }
    }
    async register(registerDto) {
        const { email, password, name, recaptchaToken } = registerDto;
        await this.validateRecaptcha(recaptchaToken);
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                configuracion: {
                    create: {
                        limiteGastos: 1000,
                        notificacionesEmail: true,
                        alertas: true,
                    },
                },
            },
        });
        await this.crearCategoriasPredeterminadas(user.id);
        const token = this.generateToken(user.id, user.email);
        return {
            user: { id: user.id, email: user.email, name: user.name },
            token,
        };
    }
    async login(loginDto) {
        const { email, password, recaptchaToken } = loginDto;
        await this.validateRecaptcha(recaptchaToken);
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const token = this.generateToken(user.id, user.email);
        return {
            user: { id: user.id, email: user.email, name: user.name },
            token,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        return user;
    }
    generateToken(userId, email) {
        return this.jwtService.sign({ sub: userId, email });
    }
    async validateGoogleUser(googleUser) {
        let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    googleId: googleUser.googleId,
                    password: '',
                    configuracion: {
                        create: {
                            limiteGastos: 1000,
                            notificacionesEmail: true,
                            alertas: true,
                        },
                    },
                },
            });
            await this.crearCategoriasPredeterminadas(user.id);
        }
        else if (!user.googleId) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { googleId: googleUser.googleId },
            });
        }
        const token = this.generateToken(user.id, user.email);
        return {
            user: { id: user.id, email: user.email, name: user.name, picture: googleUser.picture },
            token,
        };
    }
    async crearCategoriasPredeterminadas(userId) {
        const categoriasIngreso = [
            { nombre: 'Salario', icono: '💵' },
            { nombre: 'Freelance', icono: '💻' },
            { nombre: 'Inversiones', icono: '📈' },
            { nombre: 'Otros Ingresos', icono: '💰' },
        ];
        const categoriasGasto = [
            { nombre: 'Alimentación', icono: '🍔' },
            { nombre: 'Transporte', icono: '🚗' },
            { nombre: 'Servicios', icono: '💡' },
            { nombre: 'Entretenimiento', icono: '🎮' },
            { nombre: 'Salud', icono: '🏥' },
            { nombre: 'Educación', icono: '📚' },
            { nombre: 'Ropa', icono: '👕' },
            { nombre: 'Otros Gastos', icono: '📦' },
        ];
        const categorias = [
            ...categoriasIngreso.map(c => ({ ...c, tipo: 'ingreso', userId })),
            ...categoriasGasto.map(c => ({ ...c, tipo: 'gasto', userId })),
        ];
        await this.prisma.categoria.createMany({ data: categorias });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map