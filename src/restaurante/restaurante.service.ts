/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Tipo } from './tipo.enum';

@Injectable()
export class RestauranteService {

    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    ) {}

    async findAll(): Promise<RestauranteEntity[]> {
        return await this.restauranteRepository.find({
            relations: {
                platos: true,
            }
        })
    }

    async findOne(id: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id
            },
            relations: {
                platos: true,
            }
        });

        if (!restaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        return restaurante;
    
    }


    async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        await this.validateRestaurante(restaurante);
        return await this.restauranteRepository.save(restaurante);
    }

    async update(id: string, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        const persistedRestaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id
            }
        });

        if (!persistedRestaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        await this.validateRestaurante(restaurante);
        
        return await this.restauranteRepository.save({ ...persistedRestaurante, ...restaurante });
    }


    async delete(id: string) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id
            }
        });

        if (!restaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        await this.restauranteRepository.remove(restaurante);
    }



    async validateRestaurante(restaurante: RestauranteEntity) {
        if (!Object.values(Tipo).includes(restaurante.tipoCocina as Tipo)) {
            throw new BusinessLogicException("El tipo de cocina no es válido", BusinessError.BAD_REQUEST);
        }
    }

}
