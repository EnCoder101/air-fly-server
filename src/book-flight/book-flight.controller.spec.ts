import { Test, TestingModule } from '@nestjs/testing';
import { BookFlightController } from './book-flight.controller';

describe('BookFlightController', () => {
  let controller: BookFlightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookFlightController],
    }).compile();

    controller = module.get<BookFlightController>(BookFlightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
