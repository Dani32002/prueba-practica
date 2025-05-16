/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { PlatoModule } from './plato/plato.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoEntity } from './plato/plato.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { RestaurantePlatoModule } from './restaurante-plato/restaurante-plato.module';

@Module({
  imports: [RestauranteModule, PlatoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'restaurantes',
      entities: [PlatoEntity, RestauranteEntity],
      dropSchema: true,
      synchronize: true,
    }),
    RestaurantePlatoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
