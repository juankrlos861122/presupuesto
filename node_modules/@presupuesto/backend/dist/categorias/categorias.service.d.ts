import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
export declare class CategoriasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createCategoriaDto: CreateCategoriaDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }>;
    findAll(userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }[]>;
    findByTipo(userId: number, tipo: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }[]>;
    findOne(userId: number, id: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }>;
    update(userId: number, id: number, updateCategoriaDto: any): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
}
