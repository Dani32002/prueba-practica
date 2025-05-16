/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteService } from './restaurante.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Tipo } from './tipo.enum';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restaurantes: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));

    await seedDatabase();
  });

  async function seedDatabase() {

    await repository.clear();

    const tipos = Object.values(Tipo);

    restaurantes = [];
    for (let i = 0; i < 5; i++) {
      const randomTipo = tipos[Math.floor(Math.random() * tipos.length)];
      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        paginaWeb: faker.internet.url(),
        tipoCocina: randomTipo,
      })
      restaurantes.push(restaurante);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurantes', async () => {
    const result: RestauranteEntity[] = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(restaurantes.length);
  });

  it('findOne should return a restaurante by id', async () => {
    const storedRestaurante: RestauranteEntity = restaurantes[0];
    const restaurante: RestauranteEntity = await service.findOne(storedRestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre);
    expect(restaurante.direccion).toEqual(storedRestaurante.direccion);
    expect(restaurante.paginaWeb).toEqual(storedRestaurante.paginaWeb);
    expect(restaurante.tipoCocina).toEqual(storedRestaurante.tipoCocina);
  });

  it('findOne should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

  it('Create should return a new restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      paginaWeb: faker.internet.url(),
      tipoCocina: Tipo.COLOMBIANA,
      platos: [],
    }

    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await repository.findOne({ where: { id: newRestaurante.id } });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(newRestaurante.nombre);
    expect(storedRestaurante.direccion).toEqual(newRestaurante.direccion);
    expect(storedRestaurante.paginaWeb).toEqual(newRestaurante.paginaWeb);
    expect(storedRestaurante.tipoCocina).toEqual(newRestaurante.tipoCocina);

    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
    expect(storedRestaurante.direccion).toEqual(restaurante.direccion);
    expect(storedRestaurante.paginaWeb).toEqual(restaurante.paginaWeb);
    expect(storedRestaurante.tipoCocina).toEqual(restaurante.tipoCocina);
  });

  it('Create should throw an exception for an invalid restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      paginaWeb: faker.internet.url(),
      tipoCocina: "invalid" as Tipo,
      platos: [],
    }

    await expect(() => service.create(restaurante)).rejects.toHaveProperty("message", "El tipo de cocina no es válido");
  });

  it('update should modify a restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantes[0];
    restaurante.nombre = "New name";

    const updatedRestaurante: RestauranteEntity = await service.update(restaurante.id, restaurante);
    expect(updatedRestaurante).not.toBeNull();
    expect(updatedRestaurante.nombre).toEqual(restaurante.nombre);
    expect(updatedRestaurante.direccion).toEqual(restaurante.direccion);
    expect(updatedRestaurante.paginaWeb).toEqual(restaurante.paginaWeb);
    expect(updatedRestaurante.tipoCocina).toEqual(restaurante.tipoCocina);

    const storedRestaurante: RestauranteEntity = await repository.findOne({ where: { id: restaurante.id } });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
    expect(storedRestaurante.direccion).toEqual(restaurante.direccion);
    expect(storedRestaurante.paginaWeb).toEqual(restaurante.paginaWeb);
    expect(storedRestaurante.tipoCocina).toEqual(restaurante.tipoCocina);
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantes[0];
    restaurante.tipoCocina = "invalid" as Tipo;

    await expect(() => service.update(restaurante.id, restaurante)).rejects.toHaveProperty("message", "El tipo de cocina no es válido");
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantes[0];
    restaurante.nombre = "New name";

    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

  it('delete should remove a restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantes[0];
    await service.delete(restaurante.id);

    const deletedRestaurante: RestauranteEntity = await repository.findOne({ where: { id: restaurante.id } });
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

});
