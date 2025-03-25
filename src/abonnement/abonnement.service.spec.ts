import { Test, TestingModule } from '@nestjs/testing';
import { IAbonnemntService } from './abonnement.service.interface';
import { AbonnementService } from './abonnement.service';

describe('AbonnementService', () => {
  let service: IAbonnemntService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: IAbonnemntService,
        useClass: AbonnementService
      }],
    }).compile();

    service = module.get<IAbonnemntService>(IAbonnemntService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
