import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { IEquipmentService } from './equipment.service.interface';

describe('EquipmentController', () => {
  let controller: EquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipmentController],
      providers: [
        {
          provide: IEquipmentService,
          useClass: EquipmentService,
        },
      ],
    }).compile();

    controller = module.get<EquipmentController>(EquipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
