import { Test, TestingModule } from '@nestjs/testing';
import { SearchFlightsService } from './search-flights.service';

describe('SearchFlightsService', () => {
  let service: SearchFlightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchFlightsService],
    }).compile();

    service = module.get<SearchFlightsService>(SearchFlightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
