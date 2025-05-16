/* eslint-disable prettier/prettier */

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "./categoria.enum";
import { RestauranteEntity } from "../restaurante/restaurante.entity";

@Entity()
export class PlatoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    precio: number;

    @Column()
    categoria: Categoria;

    @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.platos)
    restaurantes: RestauranteEntity[];

}
