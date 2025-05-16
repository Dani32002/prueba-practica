/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteDto } from './restaurante.dto';
import { plainToInstance } from 'class-transformer';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {

    constructor(private readonly restauranteService: RestauranteService) {}

    @Get()
    async findAll(): Promise<RestauranteEntity[]> {
        return await this.restauranteService.findAll();
    }

    @Get(':restauranteId')
    async findOne(@Param('restauranteId') restauranteId: string): Promise<RestauranteEntity> {
        return await this.restauranteService.findOne(restauranteId);
    }

    @Post()
    async create(@Body() restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.create(restaurante);
    }

    @Put(':restauranteId')
    async update(@Param('restauranteId') restauranteId: string, @Body() restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.update(restauranteId, restaurante);
    }

    @Delete(':restauranteId')
    @HttpCode(204)
    async delete(@Param('restauranteId') restauranteId: string) {
        await this.restauranteService.delete(restauranteId);
    }


}
