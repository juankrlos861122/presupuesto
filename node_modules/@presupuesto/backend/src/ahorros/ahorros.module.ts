import { Module } from '@nestjs/common';
import { AhorrosService } from './ahorros.service';
import { AhorrosController } from './ahorros.controller';

@Module({
  providers: [AhorrosService],
  controllers: [AhorrosController],
  exports: [AhorrosService],
})
export class AhorrosModule {}