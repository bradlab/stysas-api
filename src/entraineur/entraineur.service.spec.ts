import { Test, TestingModule } from '@nestjs/testing';
import { IEntraineurService } from './entraineur.service.interface';
import { EntraineurService } from './entraineur.service';

describe('EntraineurService', () => {
  let service: IEntraineurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: IEntraineurService,
        useClass: EntraineurService
      }],
    }).compile();

    service = module.get<IEntraineurService>(IEntraineurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
