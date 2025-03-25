import { Test, TestingModule } from '@nestjs/testing';
import { AbonnementController } from './abonnement.controller';
import { AbonnementService } from './abonnement.service';
import { IAbonnemntService } from './abonnement.service.interface';

describe('AbonnementController', () => {
  let controller: AbonnementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbonnementController],
      providers: [
        {
          provide: IAbonnemntService,
          useClass: AbonnementService,
        },
      ],
    }).compile();

    controller = module.get<AbonnementController>(AbonnementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
