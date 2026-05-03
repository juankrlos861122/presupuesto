import { Response } from 'express';
import { ExportService } from './export.service';
export declare class ExportController {
    private exportService;
    constructor(exportService: ExportService);
    exportPDF(req: any, mes?: string, año?: string, res?: Response): Promise<void>;
    exportExcel(req: any, mes?: string, año?: string, res?: Response): Promise<void>;
}
