import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentService } from './equipment.service';
import { IEquipmentService } from './equipment.service.interface';

describe('EquipmentService', () => {
  let service: IEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: IEquipmentService,
        useClass: EquipmentService
      }],
    }).compile();

    service = module.get<IEquipmentService>(IEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
