import { IsString, IsNumber, IsOptional, IsIn, IsInt } from 'class-validator';

export class CreateTransaccionDto {
  @IsIn(['ingreso', 'gasto'])
  tipo: 'ingreso' | 'gasto';

  @IsInt()
  categoriaId: number;

  @IsNumber()
  monto: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  fecha?: string;
}