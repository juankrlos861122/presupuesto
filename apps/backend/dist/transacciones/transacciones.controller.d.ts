import { TransaccionesService } from './transacciones.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
export declare class TransaccionesController {
    private transaccionesService;
    constructor(transaccionesService: TransaccionesService);
    create(req: any, createTransaccionDto: CreateTransaccionDto): Promise<{
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    }>;
    findAll(req: any, mes?: string, año?: string, tipo?: string): Promise<({
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    })[]>;
    getResumen(req: any, mes?: string, año?: string): Promise<{
        mes: number;
        año: number;
        totalIngresos: number;
        totalGastos: number;
        balance: number;
        porcentajeAhorro: number;
        gastosPorCategoria: any[];
    }>;
    findOne(req: any, id: string): Promise<{
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    }>;
    update(req: any, id: string, updateTransaccionDto: any): Promise<{
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
