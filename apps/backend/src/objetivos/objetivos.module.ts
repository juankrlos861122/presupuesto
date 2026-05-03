import { Module } from '@nestjs/common';
import { ObjetivosService } from './objetivos.service';
import { ObjetivosController } from './objetivos.controller';

@Module({
  providers: [ObjetivosService],
  controllers: [ObjetivosController],
  exports: [ObjetivosService],
})
export class ObjetivosModule {}