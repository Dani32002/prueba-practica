/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantePlatoController } from './restaurante-plato.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])],
    providers: [RestaurantePlatoService],
    controllers: [RestaurantePlatoController]
})
export class RestaurantePlatoModule {}
