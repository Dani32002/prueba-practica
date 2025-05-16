/* eslint-disable prettier/prettier */

import { PlatoEntity } from "../plato/plato.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tipo } from "./tipo.enum";

@Entity()
export class RestauranteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column()
    tipoCocina: Tipo;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => PlatoEntity, (plato) => plato.restaurantes)
    @JoinTable()
    platos: PlatoEntity[];

}
