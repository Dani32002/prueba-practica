/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Categoria } from '../plato/categoria.enum';
import { Tipo } from '../restaurante/tipo.enum';

describe('RestaurantePlatoService', () => {
  let service: RestaurantePlatoService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let platoRepository: Repository<PlatoEntity>;
  let restaurante: RestauranteEntity;
  let platos: PlatoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantePlatoService],
    }).compile();

    service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    platoRepository = module.get<Repository<PlatoEntity>>(getRepositoryToken(PlatoEntity));
    await seedDatabase();
  });

  async function seedDatabase() {
    await restauranteRepository.clear();
    await platoRepository.clear();

    const categorias = Object.values(Categoria);

    platos = [];
    for (let i = 0; i < 5; i++) {
      const randomCategoria = categorias[Math.floor(Math.random() * categorias.length)];
      const plato: PlatoEntity = await platoRepository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        precio: parseInt(faker.commerce.price()),
        categoria: randomCategoria,
      });
      platos.push(plato);
    }

    const tipos = Object.values(Tipo);
    const randomTipo = tipos[Math.floor(Math.random() * tipos.length)];

    restaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      paginaWeb: faker.internet.url(),
      platos: platos,
      tipoCocina: randomTipo,
    });
  
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDishToRestaurant should add a plato to a restaurante', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.PLATO_FUERTE,
    });

    const result: RestauranteEntity = await service.addDishToRestaurant(restaurante.id, newPlato.id);

    expect(result).not.toBeNull();
    expect(result.platos.length).toBe(platos.length + 1);
    expect(result.platos[platos.length].nombre).toEqual(newPlato.nombre);
    expect(result.platos[platos.length].descripcion).toEqual(newPlato.descripcion);
    expect(result.platos[platos.length].precio).toEqual(newPlato.precio);
    expect(result.platos[platos.length].categoria).toEqual(newPlato.categoria);
  });

  it('addDishToRestaurant should throw an exception for an invalid restaurante', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.PLATO_FUERTE,
    });

    await expect(() => service.addDishToRestaurant("0", newPlato.id)).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

  it('addDishToRestaurant should throw an exception for an invalid plato', async () => {
    await expect(() => service.addDishToRestaurant(restaurante.id, "0")).rejects.toHaveProperty("message", "El plato con el id dado no se encontró");
  });

  it('findDishesFromRestaurant should return platos by restaurante', async () => {
    const result: PlatoEntity[] = await service.findDishesFromRestaurant(restaurante.id);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(platos.length);
  });

  it('findDishesFromRestaurant should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findDishesFromRestaurant("0")).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

  it('findDishFromRestaurant should return a plato by restaurante', async () => {
    const result: PlatoEntity = await service.findDishFromRestaurant(restaurante.id, platos[0].id);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(platos[0].nombre);
    expect(result.descripcion).toEqual(platos[0].descripcion);
    expect(result.precio).toEqual(platos[0].precio);
    expect(result.categoria).toEqual(platos[0].categoria);
  });

  it('findDishFromRestaurant should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findDishFromRestaurant("0", platos[0].id)).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

  it('findDishFromRestaurant should throw an exception for an invalid plato', async () => {
    await expect(() => service.findDishFromRestaurant(restaurante.id, "0")).rejects.toHaveProperty("message", "El plato con el id dado no se encontró");
  });

  it('findDishFromRestaurant should throw an exception for an unassociated plato', async () => {
    const newDish: PlatoEntity = await platoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.PLATO_FUERTE,
    });

    await expect(() => service.findDishFromRestaurant(restaurante.id, newDish.id)).rejects.toHaveProperty("message", "El plato con el id dado no está asociado al restaurante");
  });

  it('updateDishesFromRestaurant should update platos from restaurante', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.PLATO_FUERTE,
    });

    const updatedRestaurante: RestauranteEntity = await service.updateDishesFromRestaurant(restaurante.id, [newPlato]);

    expect(updatedRestaurante).not.toBeNull();
    expect(updatedRestaurante.platos.length).toBe(1);
    expect(updatedRestaurante.platos[0].nombre).toEqual(newPlato.nombre);
    expect(updatedRestaurante.platos[0].descripcion).toEqual(newPlato.descripcion);
    expect(updatedRestaurante.platos[0].precio).toEqual(newPlato.precio);
    expect(updatedRestaurante.platos[0].categoria).toEqual(newPlato.categoria);

    const storedRestaurante: RestauranteEntity = await restauranteRepository.findOne({ where: { id: restaurante.id }, relations: { platos: true } });

    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.platos.length).toBe(1);
    expect(storedRestaurante.platos[0].nombre).toEqual(newPlato.nombre);
    expect(storedRestaurante.platos[0].descripcion).toEqual(newPlato.descripcion);
    expect(storedRestaurante.platos[0].precio).toEqual(newPlato.precio);
    expect(storedRestaurante.platos[0].categoria).toEqual(newPlato.categoria);
  });

  it('updateDishesFromRestaurant should throw an exception for an invalid restaurante', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.PLATO_FUERTE,
    });

    await expect(() => service.updateDishesFromRestaurant("0", [newPlato])).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

  it('updateDishesFromRestaurant should throw an exception for an invalid plato', async () => {
    const newPlato: PlatoEntity = {
      id: "0",
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.PLATO_FUERTE,
      restaurantes: [],
    }
    await expect(() => service.updateDishesFromRestaurant(restaurante.id, [newPlato])).rejects.toHaveProperty("message", "El plato con el id dado no se encontró");
  });

  it('deleteDishFromRestaurant should remove a plato from restaurante', async () => {
    const plato: PlatoEntity = platos[0];

    await service.deleteDishFromRestaurant(restaurante.id, plato.id);

    const storedRestaurante: RestauranteEntity = await restauranteRepository.findOne({ where: { id: restaurante.id }, relations: { platos: true } });
    const deletedPlato: PlatoEntity = storedRestaurante.platos.find(a => a.id === plato.id);

    expect(deletedPlato).toBeUndefined();
  });

  it('deleteDishFromRestaurant should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.deleteDishFromRestaurant("0", platos[0].id)).rejects.toHaveProperty("message", "El restaurante con el id dado no se encontró");
  });

  it('deleteDishFromRestaurant should throw an exception for an invalid plato', async () => {
    await expect(() => service.deleteDishFromRestaurant(restaurante.id, "0")).rejects.toHaveProperty("message", "El plato con el id dado no se encontró");
  });

  it('deleteDishFromRestaurant should throw an exception for an unassociated plato', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.PLATO_FUERTE,
    });

    await expect(() => service.deleteDishFromRestaurant(restaurante.id, newPlato.id)).rejects.toHaveProperty("message", "El plato con el id dado no está asociado al restaurante");
  });

});
