import { AhorrosService } from './ahorros.service';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
export declare class AhorrosController {
    private ahorrosService;
    constructor(ahorrosService: AhorrosService);
    create(req: any, createAhorroDto: CreateAhorroDto): Promise<{
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
    findAll(req: any): Promise<{
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
    getResumen(req: any): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateAhorroDto: any): Promise<{
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
    depositar(req: any, id: string, body: {
        monto: number;
        fecha?: string;
    }): Promise<{
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
    getHistorial(req: any, id: string): Promise<{
        id: number;
        ahorroId: number | null;
        objetivoId: number | null;
        monto: number;
        fecha: Date;
        descripcion: string | null;
    }[]>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
