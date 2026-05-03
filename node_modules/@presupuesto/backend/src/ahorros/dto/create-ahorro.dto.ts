import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateAhorroDto {
  @IsString()
  nombre: string;

  @IsNumber()
  montoObjetivo: number;

  @IsNumber()
  @IsOptional()
  montoActual?: number;

  @IsDateString()
  fechaObjetivo: string;
}