import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  icono?: string;

  @IsIn(['ingreso', 'gasto'])
  tipo: 'ingreso' | 'gasto';
}