/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PlatoEntity } from './plato.entity';
import { PlatoDto } from './plato.dto';
import { plainToInstance } from 'class-transformer';

@Controller('dishes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatoController {

    constructor(private readonly platoService: PlatoService) {}

    @Get()
    async findAll(): Promise<PlatoEntity[]> {
        return await this.platoService.findAll();
    }

    @Get(':platoId')
    async findOne(@Param('platoId') platoId: string): Promise<PlatoEntity> {
        return await this.platoService.findOne(platoId);
    }

    @Post()
    async create(@Body() platoDto: PlatoDto): Promise<PlatoEntity> {
        const plato: PlatoEntity = plainToInstance(PlatoEntity, platoDto);
        return await this.platoService.create(plato);
    }

    @Put(':platoId')
    async update(@Param('platoId') platoId: string, @Body() platoDto: PlatoDto): Promise<PlatoEntity> {
        const plato: PlatoEntity = plainToInstance(PlatoEntity, platoDto);
        return await this.platoService.update(platoId, plato);
    }

    @Delete(':platoId')
    @HttpCode(204)
    async delete(@Param('platoId') platoId: string) {
        await this.platoService.delete(platoId);
    }

}
