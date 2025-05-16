/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteController } from './restaurante.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestauranteEntity])
  ],
  providers: [RestauranteService],
  controllers: [RestauranteController]
})
export class RestauranteModule {}
