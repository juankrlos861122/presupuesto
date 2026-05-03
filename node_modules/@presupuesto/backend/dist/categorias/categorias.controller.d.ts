import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
export declare class CategoriasController {
    private categoriasService;
    constructor(categoriasService: CategoriasService);
    create(req: any, createCategoriaDto: CreateCategoriaDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }>;
    findAll(req: any): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }[]>;
    findByTipo(req: any, tipo: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }[]>;
    findOne(req: any, id: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }>;
    update(req: any, id: string, updateCategoriaDto: any): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        tipo: string;
        nombre: string;
        icono: string;
        esPersonalizada: boolean;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
