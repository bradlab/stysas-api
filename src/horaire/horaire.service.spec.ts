import { Test, TestingModule } from '@nestjs/testing';
import { HoraireService } from './horaire.service';
import { IHoraireService } from './horaire.service.interface';

describe('HoraireService', () => {
  let service: IHoraireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: IHoraireService,
        useClass: HoraireService
      }],
    }).compile();

    service = module.get<IHoraireService>(IHoraireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
