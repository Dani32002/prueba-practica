/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatoEntity } from '../plato/plato.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestaurantePlatoService {

    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
        @InjectRepository(PlatoEntity)
        private readonly platoRepository: Repository<PlatoEntity>,
    ) {}

    async addDishToRestaurant(restaurantId: string, dishId: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id: restaurantId
            },
            relations: {
                platos: true,
            }
        });
        
        if (!restaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        const plato: PlatoEntity = await this.platoRepository.findOne({
            where: {
                id: dishId
            }
        });

        if (!plato) {
            throw new BusinessLogicException("El plato con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        restaurante.platos = [...restaurante.platos, plato];
        return await this.restauranteRepository.save(restaurante);
    
    }

    async findDishesFromRestaurant(restaurantId: string): Promise<PlatoEntity[]> {

        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id: restaurantId
            },
            relations: {
                platos: {
                    restaurantes: true,
                },
            }
        });

        if (!restaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        return restaurante.platos;

    }

    async findDishFromRestaurant(restaurantId: string, dishId: string): Promise<PlatoEntity> {
    
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id: restaurantId
            },
            relations: {
                platos: true,
            }
        });

        if (!restaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        const plato: PlatoEntity = await this.platoRepository.findOne({
            where: {
                id: dishId
            },
            relations: {
                restaurantes: true,
            }
        });

        if (!plato) {
            throw new BusinessLogicException("El plato con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        if (!restaurante.platos.find(p => p.id === dishId)) {
            throw new BusinessLogicException("El plato con el id dado no está asociado al restaurante", BusinessError.PRECONDITION_FAILED);
        }

        return plato;
    
    }

    async updateDishesFromRestaurant(restaurantId: string, dishes: PlatoEntity[]): Promise<RestauranteEntity> {
    
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id: restaurantId
            },
            relations: {
                platos: true,
            }
        });

        if (!restaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        const platos: PlatoEntity[] = [];

        for (let i = 0; i < dishes.length; i++) {
            const plato: PlatoEntity = await this.platoRepository.findOne({
                where: {
                    id: dishes[i].id
                },
            });
            
            if (!plato) {
                throw new BusinessLogicException("El plato con el id dado no se encontró", BusinessError.NOT_FOUND);
            }

            platos.push(plato);
        }

        restaurante.platos = platos;
        return await this.restauranteRepository.save(restaurante);
    
    }

    async deleteDishFromRestaurant(restaurantId: string, dishId: string) {
        
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: {
                id: restaurantId
            },
            relations: {
                platos: true,
            }
        });

        if (!restaurante) {
            throw new BusinessLogicException("El restaurante con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        const plato: PlatoEntity = await this.platoRepository.findOne({
            where: {
                id: dishId
            },
            relations: {
                restaurantes: true,
            }
        });

        if (!plato) {
            throw new BusinessLogicException("El plato con el id dado no se encontró", BusinessError.NOT_FOUND);
        }

        if (!restaurante.platos.find(p => p.id === dishId)) {
            throw new BusinessLogicException("El plato con el id dado no está asociado al restaurante", BusinessError.PRECONDITION_FAILED);
        }

        restaurante.platos = restaurante.platos.filter(p => p.id !== dishId);
        await this.restauranteRepository.save(restaurante);

    }

}
