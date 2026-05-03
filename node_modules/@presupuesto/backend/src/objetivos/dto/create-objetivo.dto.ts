import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsInt } from 'class-validator';

export class CreateObjetivoDto {
  @IsString()
  nombre: string;

  @IsNumber()
  montoObjetivo: number;

  @IsNumber()
  @IsOptional()
  montoActual?: number;

  @IsInt()
  @IsOptional()
  categoriaId?: number;

  @IsDateString()
  fechaLimite: string;

  @IsBoolean()
  @IsOptional()
  notificaciones?: boolean;
}