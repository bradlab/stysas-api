import { Test, TestingModule } from '@nestjs/testing';
import { SalleController } from './salle.controller';
import { SalleService } from './salle.service';
import { ISalleService } from './salle.service.interface';

describe('SalleController', () => {
  let controller: SalleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalleController],
      providers: [
        {
          provide: ISalleService,
          useClass: SalleService,
        },
      ],
    }).compile();

    controller = module.get<SalleController>(SalleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
