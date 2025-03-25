import { Test, TestingModule } from '@nestjs/testing';
import { IDisponibiliteService } from './disponibilite.service.interface';
import { DisponibiliteService } from './disponibilite.service';

describe('DisponibiliteService', () => {
  let service: IDisponibiliteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: IDisponibiliteService,
        useClass: DisponibiliteService
      }],
    }).compile();

    service = module.get<IDisponibiliteService>(IDisponibiliteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
