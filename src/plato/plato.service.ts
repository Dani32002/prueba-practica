/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatoEntity } from './plato.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Categoria } from './categoria.enum';

@Injectable()
export class PlatoService {

    constructor(
        @InjectRepository(PlatoEntity)
        private readonly platoRepository: Repository<PlatoEntity>,
    ) {}

    async findAll(): Promise<PlatoEntity[]> {
        return await this.platoRepository.find({
            relations: {
                restaurantes: true,
            }
        });
    }

    async findOne(id: string): Promise<PlatoEntity> {
        const plato: PlatoEntity = await this.platoRepository.findOne({
            where: {
                id
            },
            relations: {
                restaurantes: true,
            }
        });

        if (!plato) {
            throw new BusinessLogicException("El plato con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        return plato;
    }

    async create(plato: PlatoEntity): Promise<PlatoEntity> {
        await this.validatePlato(plato);
        return await this.platoRepository.save(plato);
    }

    async update(id: string, plato: PlatoEntity): Promise<PlatoEntity> {
        const persistedPlato: PlatoEntity = await this.platoRepository.findOne({
            where: {
                id
            },
        });

        if (!persistedPlato) {
            throw new BusinessLogicException("El plato con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        await this.validatePlato(plato);

        return await this.platoRepository.save({ ...persistedPlato, ...plato });

    }

    async delete(id: string) {
    
        const plato: PlatoEntity = await this.platoRepository.findOne({
            where: {
                id
            }
        });

        if (!plato) {
            throw new BusinessLogicException("El plato con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        await this.platoRepository.remove(plato);
    
    }

    async validatePlato(plato: PlatoEntity) {
        if (!Object.values(Categoria).includes(plato.categoria as Categoria)) {
            throw new BusinessLogicException("La categoria del plato no es válida", BusinessError.BAD_REQUEST);
        }

        if (plato.precio <= 0) {
            throw new BusinessLogicException("El precio del plato no es válido", BusinessError.BAD_REQUEST);
        }

    }

}
