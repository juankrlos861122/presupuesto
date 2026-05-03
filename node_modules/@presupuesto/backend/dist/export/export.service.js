"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
let ExportService = class ExportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportPDF(userId, mes, año) {
        const now = new Date();
        const month = mes || now.getMonth() + 1;
        const year = año || now.getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const transacciones = await this.prisma.transaccion.findMany({
            where: { userId, fecha: { gte: startDate, lte: endDate } },
            include: { categoria: true },
            orderBy: { fecha: 'desc' },
        });
        const ahorros = await this.prisma.ahorro.findMany({ where: { userId } });
        const objetivos = await this.prisma.objetivo.findMany({ where: { userId, completado: false } });
        const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
        const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.fontSize(24).text('Reporte de Presupuesto', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Usuario: ${user?.name}`, { align: 'center' });
        doc.text(`Período: ${month}/${year}`, { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(18).fillColor('#2c3e50').text('Resumen Financiero', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('black');
        const data = [
            ['Total Ingresos', `$${ingresos.toFixed(2)}`],
            ['Total Gastos', `$${gastos.toFixed(2)}`],
            ['Balance', `$${(ingresos - gastos).toFixed(2)}`],
            ['Ahorros Totales', `$${ahorros.reduce((s, a) => s + a.montoActual, 0).toFixed(2)}`],
            ['Objetivos Activos', objetivos.length.toString()],
        ];
        data.forEach(([label, value]) => {
            doc.text(`${label}: ${value}`);
        });
        doc.moveDown(2);
        doc.fontSize(18).fillColor('#2c3e50').text('Transacciones', { underline: true });
        doc.moveDown();
        doc.fontSize(10);
        transacciones.forEach((t) => {
            const fecha = new Date(t.fecha).toLocaleDateString();
            doc.text(`${fecha} | ${t.tipo.toUpperCase()} | ${t.categoria?.nombre || 'Sin categoría'} | $${t.monto.toFixed(2)}${t.descripcion ? ` - ${t.descripcion}` : ''}`);
        });
        doc.moveDown(2);
        doc.fontSize(18).fillColor('#2c3e50').text('Ahorros', { underline: true });
        doc.moveDown();
        doc.fontSize(10);
        ahorros.forEach((a) => {
            const progreso = ((a.montoActual / a.montoObjetivo) * 100).toFixed(1);
            doc.text(`${a.nombre}: $${a.montoActual.toFixed(2)} / $${a.montoObjetivo.toFixed(2)} (${progreso}%)`);
        });
        doc.moveDown(2);
        doc.fontSize(18).fillColor('#2c3e50').text('Objetivos', { underline: true });
        doc.moveDown();
        doc.fontSize(10);
        objetivos.forEach((o) => {
            const progreso = ((o.montoActual / o.montoObjetivo) * 100).toFixed(1);
            const fechaLimite = new Date(o.fechaLimite).toLocaleDateString();
            doc.text(`${o.nombre}: $${o.montoActual.toFixed(2)} / $${o.montoObjetivo.toFixed(2)} (${progreso}%) - Vence: ${fechaLimite}`);
        });
        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
    async exportExcel(userId, mes, año) {
        const now = new Date();
        const month = mes || now.getMonth() + 1;
        const year = año || now.getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const transacciones = await this.prisma.transaccion.findMany({
            where: { userId, fecha: { gte: startDate, lte: endDate } },
            include: { categoria: true },
            orderBy: { fecha: 'desc' },
        });
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Presupuesto Personal';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Transacciones');
        sheet.columns = [
            { header: 'Fecha', key: 'fecha', width: 12 },
            { header: 'Tipo', key: 'tipo', width: 10 },
            { header: 'Categoría', key: 'categoria', width: 20 },
            { header: 'Monto', key: 'monto', width: 12 },
            { header: 'Descripción', key: 'descripcion', width: 30 },
        ];
        transacciones.forEach((t) => {
            sheet.addRow({
                fecha: new Date(t.fecha).toLocaleDateString(),
                tipo: t.tipo,
                categoria: t.categoria?.nombre || 'Sin categoría',
                monto: t.monto,
                descripcion: t.descripcion || '',
            });
        });
        const sheetAhorros = workbook.addWorksheet('Ahorros');
        const ahorros = await this.prisma.ahorro.findMany({ where: { userId } });
        sheetAhorros.columns = [
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Actual', key: 'actual', width: 15 },
            { header: 'Objetivo', key: 'objetivo', width: 15 },
            { header: 'Progreso %', key: 'progreso', width: 12 },
        ];
        ahorros.forEach((a) => {
            sheetAhorros.addRow({
                nombre: a.nombre,
                actual: a.montoActual,
                objetivo: a.montoObjetivo,
                progreso: ((a.montoActual / a.montoObjetivo) * 100).toFixed(1),
            });
        });
        const sheetObjetivos = workbook.addWorksheet('Objetivos');
        const objetivos = await this.prisma.objetivo.findMany({ where: { userId, completado: false } });
        sheetObjetivos.columns = [
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Actual', key: 'actual', width: 15 },
            { header: 'Objetivo', key: 'objetivo', width: 15 },
            { header: 'Fecha Límite', key: 'fechaLimite', width: 15 },
        ];
        objetivos.forEach((o) => {
            sheetObjetivos.addRow({
                nombre: o.nombre,
                actual: o.montoActual,
                objetivo: o.montoObjetivo,
                fechaLimite: new Date(o.fechaLimite).toLocaleDateString(),
            });
        });
        return await workbook.xlsx.writeBuffer();
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map