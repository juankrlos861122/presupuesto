export declare class CreateTransaccionDto {
    tipo: 'ingreso' | 'gasto';
    categoriaId: number;
    monto: number;
    descripcion?: string;
    fecha?: string;
}
