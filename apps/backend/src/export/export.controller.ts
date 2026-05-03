import { Controller, Get, Query, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('pdf')
  async exportPDF(@Request() req, @Query('mes') mes?: string, @Query('año') año?: string, @Res() res?: Response) {
    const buffer = await this.exportService.exportPDF(
      req.user.userId,
      mes ? parseInt(mes) : undefined,
      año ? parseInt(año) : undefined,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="presupuesto_${mes || 'actual'}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('excel')
  async exportExcel(@Request() req, @Query('mes') mes?: string, @Query('año') año?: string, @Res() res?: Response) {
    const buffer = await this.exportService.exportExcel(
      req.user.userId,
      mes ? parseInt(mes) : undefined,
      año ? parseInt(año) : undefined,
    );

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="presupuesto_${mes || 'actual'}.xlsx"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}