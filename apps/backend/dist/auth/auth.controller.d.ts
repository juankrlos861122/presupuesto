import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
    getProfile(req: any): Promise<{
        email: string;
        name: string;
        id: number;
        createdAt: Date;
    }>;
}
