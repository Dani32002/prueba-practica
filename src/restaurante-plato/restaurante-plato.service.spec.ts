import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantePlatoService } from './restaurante-plato.service';

describe('RestaurantePlatoService', () => {
  let service: RestaurantePlatoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantePlatoService],
    }).compile();

    service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
