import { Test, TestingModule } from '@nestjs/testing';
import { BookFlightService } from './book-flight.service';

describe('BookFlightService', () => {
  let service: BookFlightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookFlightService],
    }).compile();

    service = module.get<BookFlightService>(BookFlightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
