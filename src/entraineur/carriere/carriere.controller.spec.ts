import { Test, TestingModule } from '@nestjs/testing';
import { CarriereController } from './carriere.controller';
import { CarriereService } from './carriere.service';
import { ICarriereService } from './carriere.service.interface';

describe('CarriereController', () => {
  let controller: CarriereController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarriereController],
      providers: [
        {
          provide: ICarriereService,
          useClass: CarriereService,
        },
      ],
    }).compile();

    controller = module.get<CarriereController>(CarriereController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
