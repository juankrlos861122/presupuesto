import { PrismaService } from '../prisma/prisma.service';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
export declare class AhorrosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createAhorroDto: CreateAhorroDto): Promise<{
        id: number;
        userId: number;
        nombre: string;
        montoActual: number;
        montoObjetivo: number;
        fechaInicio: Date;
        fechaObjetivo: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: number): Promise<{
        id: number;
        userId: number;
        nombre: string;
        montoActual: number;
        montoObjetivo: number;
        fechaInicio: Date;
        fechaObjetivo: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(userId: number, id: number): Promise<{
        id: number;
        userId: number;
        nombre: string;
        montoActual: number;
        montoObjetivo: number;
        fechaInicio: Date;
        fechaObjetivo: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(userId: number, id: number, updateAhorroDto: any): Promise<{
        id: number;
        userId: number;
        nombre: string;
        montoActual: number;
        montoObjetivo: number;
        fechaInicio: Date;
        fechaObjetivo: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
    depositar(userId: number, id: number, monto: number, fecha?: string): Promise<{
        id: number;
        userId: number;
        nombre: string;
        montoActual: number;
        montoObjetivo: number;
        fechaInicio: Date;
        fechaObjetivo: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getHistorial(userId: number, ahorroId: number): Promise<{
        id: number;
        ahorroId: number | null;
        objetivoId: number | null;
        monto: number;
        fecha: Date;
        descripcion: string | null;
    }[]>;
    getResumen(userId: number): Promise<{
        totalAhorrado: number;
        totalObjetivo: number;
        porcentajeGeneral: number;
        cantidad: number;
        ahorros: {
            id: number;
            userId: number;
            nombre: string;
            montoActual: number;
            montoObjetivo: number;
            fechaInicio: Date;
            fechaObjetivo: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
}
