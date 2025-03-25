import { Test, TestingModule } from '@nestjs/testing';
import { ISalleService } from './salle.service.interface';
import { SalleService } from './salle.service';

describe('SalleService', () => {
  let service: ISalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: ISalleService,
        useClass: SalleService
      }],
    }).compile();

    service = module.get<ISalleService>(ISalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
