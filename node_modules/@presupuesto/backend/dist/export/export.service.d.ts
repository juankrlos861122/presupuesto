import { PrismaService } from '../prisma/prisma.service';
export declare class ExportService {
    private prisma;
    constructor(prisma: PrismaService);
    exportPDF(userId: number, mes?: number, año?: number): Promise<Buffer<ArrayBufferLike>>;
    exportExcel(userId: number, mes?: number, año?: number): Promise<Buffer<ArrayBufferLike>>;
}
