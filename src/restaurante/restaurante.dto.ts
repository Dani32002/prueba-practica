/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class RestauranteDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @IsString()
    @IsNotEmpty()
    readonly tipoCocina: string;

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    readonly paginaWeb: string;

}
