/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoEntity } from './plato.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlatoEntity])
  ],
  providers: [PlatoService]
})
export class PlatoModule {}
