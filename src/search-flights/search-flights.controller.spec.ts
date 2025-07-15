import { Test, TestingModule } from '@nestjs/testing';
import { SearchFlightsController } from './search-flights.controller';

describe('SearchFlightsController', () => {
  let controller: SearchFlightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchFlightsController],
    }).compile();

    controller = module.get<SearchFlightsController>(SearchFlightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
