import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as https from 'https';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async verifyRecaptcha(token: string): Promise<boolean> {
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
          } catch (e) {
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

  private async validateRecaptcha(token?: string) {
    if (!token || token === '') {
      return;
    }
    const isValid = await this.verifyRecaptcha(token);
    if (!isValid) {
      throw new BadRequestException('Verificación de seguridad fallida');
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, recaptchaToken } = registerDto;

    await this.validateRecaptcha(recaptchaToken);

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
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

  async login(loginDto: LoginDto) {
    const { email, password, recaptchaToken } = loginDto;

    await this.validateRecaptcha(recaptchaToken);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return user;
  }

  private generateToken(userId: number, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  async validateGoogleUser(googleUser: { googleId: string; email: string; name: string; picture?: string }) {
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
    } else if (!user.googleId) {
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

  private async crearCategoriasPredeterminadas(userId: number) {
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
}