/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PlatoService } from './plato.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PlatoEntity } from './plato.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Categoria } from './categoria.enum';

describe('PlatoService', () => {
  let service: PlatoService;
  let repository: Repository<PlatoEntity>;
  let platos: PlatoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PlatoService],
    }).compile();

    service = module.get<PlatoService>(PlatoService);
    repository = module.get<Repository<PlatoEntity>>(getRepositoryToken(PlatoEntity));
    await seedDatabase();
  });

  async function seedDatabase() {
    await repository.clear();

    const categorias = Object.values(Categoria);

    platos = [];
    for (let i = 0; i < 5; i++) {
      const randomCategoria = categorias[Math.floor(Math.random() * categorias.length)];
      const plato: PlatoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        precio: parseInt(faker.commerce.price()),
        categoria: randomCategoria,
      });
      platos.push(plato);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all platos', async () => {
    const result: PlatoEntity[] = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(platos.length);
  });

  it('findOne should return a plato by id', async () => {
    const plato: PlatoEntity = platos[0];

    const foundPlato: PlatoEntity = await service.findOne(plato.id);
    expect(foundPlato).not.toBeNull();
    expect(foundPlato.nombre).toEqual(plato.nombre);
    expect(foundPlato.descripcion).toEqual(plato.descripcion);
    expect(foundPlato.precio).toEqual(plato.precio);
    expect(foundPlato.categoria).toEqual(plato.categoria);

    const storedPlato: PlatoEntity = await repository.findOne({ where: { id: plato.id } });
    expect(storedPlato).not.toBeNull();
    expect(storedPlato.nombre).toEqual(plato.nombre);
    expect(storedPlato.descripcion).toEqual(plato.descripcion);
    expect(storedPlato.precio).toEqual(plato.precio);
    expect(storedPlato.categoria).toEqual(plato.categoria);
  });

  it('findOne should throw an exception for an invalid plato', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El plato con el id dado no se encontró");
  });

  it('Create should return a new plato', async () => {
    const plato: PlatoEntity = {
      id: "",
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseInt(faker.commerce.price()),
      categoria: Categoria.ENTRADA,
      restaurantes: [],
    };

    const newPlato: PlatoEntity = await service.create(plato);
    expect(newPlato).not.toBeNull();
    expect(newPlato.nombre).toEqual(plato.nombre);
    expect(newPlato.descripcion).toEqual(plato.descripcion);
    expect(newPlato.precio).toEqual(plato.precio);
    expect(newPlato.categoria).toEqual(plato.categoria);

    const storedPlato: PlatoEntity = await repository.findOne({ where: { id: newPlato.id } });
    expect(storedPlato).not.toBeNull();
    expect(storedPlato.nombre).toEqual(newPlato.nombre);
    expect(storedPlato.descripcion).toEqual(newPlato.descripcion);
    expect(storedPlato.precio).toEqual(newPlato.precio);
    expect(storedPlato.categoria).toEqual(newPlato.categoria);
  });

  it('Create should throw an exception for a plato with negative or 0 price', async () => {
    const plato: PlatoEntity = {
      id: "",
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: -10,
      categoria: Categoria.ENTRADA,
      restaurantes: [],
    };

    await expect(() => service.create(plato)).rejects.toHaveProperty("message", "El precio del plato no es válido");
  });

  it('Create should throw an exception for an invalid category', async () => {
    const plato: PlatoEntity = {
      id: "",
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseFloat(faker.commerce.price()),
      categoria: "invalid" as Categoria,
      restaurantes: [],
    };

    await expect(() => service.create(plato)).rejects.toHaveProperty("message", "La categoria del plato no es válida");
  });

  it('update should modify a plato', async () => {
    const plato: PlatoEntity = platos[0];
    plato.nombre = "New name";
    plato.descripcion = "New description";
    plato.precio = 20;
    plato.categoria = Categoria.PLATO_FUERTE;

    const updatedPlato: PlatoEntity = await service.update(plato.id, plato);
    expect(updatedPlato).not.toBeNull();
    expect(updatedPlato.nombre).toEqual(plato.nombre);
    expect(updatedPlato.descripcion).toEqual(plato.descripcion);
    expect(updatedPlato.precio).toEqual(plato.precio);
    expect(updatedPlato.categoria).toEqual(plato.categoria);

    const storedPlato: PlatoEntity = await repository.findOne({ where: { id: plato.id } });
    expect(storedPlato).not.toBeNull();
    expect(storedPlato.nombre).toEqual(plato.nombre);
    expect(storedPlato.descripcion).toEqual(plato.descripcion);
    expect(storedPlato.precio).toEqual(plato.precio);
    expect(storedPlato.categoria).toEqual(plato.categoria);
  });

  it('update should throw an exception for an invalid plato', async () => {
    const plato: PlatoEntity = platos[0];
    plato.precio = 10;

    await expect(() => service.update("0", plato)).rejects.toHaveProperty("message", "El plato con el id dado no se encontró");
  });

  it('update should throw an exception for a plato with negative or 0 price', async () => {
    const plato: PlatoEntity = platos[0];
    plato.precio = -10;

    await expect(() => service.update(plato.id, plato)).rejects.toHaveProperty("message", "El precio del plato no es válido");
  });

  it('update should throw an exception for an invalid category', async () => {
    const plato: PlatoEntity = platos[0];
    plato.categoria = "invalid" as Categoria;

    await expect(() => service.update(plato.id, plato)).rejects.toHaveProperty("message", "La categoria del plato no es válida");
  });

  it('delete should remove a plato', async () => {
    const plato: PlatoEntity = platos[0];
    await service.delete(plato.id);

    const deletedPlato: PlatoEntity = await repository.findOne({ where: { id: plato.id } });
    expect(deletedPlato).toBeNull();
  });

  it('delete should throw an exception for an invalid plato', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El plato con el id dado no se encontró");
  });



});
