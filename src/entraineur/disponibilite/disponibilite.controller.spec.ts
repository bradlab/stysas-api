import { Test, TestingModule } from '@nestjs/testing';
import { DisponibiliteController } from './disponibilite.controller';
import { DisponibiliteService } from './disponibilite.service';
import { IDisponibiliteService } from './disponibilite.service.interface';

describe('DisponibiliteController', () => {
  let controller: DisponibiliteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibiliteController],
      providers: [
        {
          provide: IDisponibiliteService,
          useClass: DisponibiliteService,
        },
      ],
    }).compile();

    controller = module.get<DisponibiliteController>(DisponibiliteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
