import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private verifyRecaptcha;
    private validateRecaptcha;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
        token: string;
    }>;
    getProfile(userId: number): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
    private generateToken;
    validateGoogleUser(googleUser: {
        googleId: string;
        email: string;
        name: string;
        picture?: string;
    }): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
            picture: string;
        };
        token: string;
    }>;
    private crearCategoriasPredeterminadas;
}
