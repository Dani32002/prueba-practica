/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoEntity } from './plato.entity';
import { PlatoController } from './plato.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlatoEntity])
  ],
  providers: [PlatoService],
  controllers: [PlatoController]
})
export class PlatoModule {}
