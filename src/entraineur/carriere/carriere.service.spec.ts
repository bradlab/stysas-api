import { Test, TestingModule } from '@nestjs/testing';
import { ICarriereService } from './carriere.service.interface';
import { CarriereService } from './carriere.service';

describe('CarriereService', () => {
  let service: ICarriereService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: ICarriereService,
        useClass: CarriereService
      }],
    }).compile();

    service = module.get<ICarriereService>(ICarriereService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
