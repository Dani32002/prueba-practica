/* eslint-disable prettier/prettier */
import { TypeOrmModule } from "@nestjs/typeorm"
import { PlatoEntity } from "../../plato/plato.entity";
import { RestauranteEntity } from "../../restaurante/restaurante.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [RestauranteEntity, PlatoEntity],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])

]