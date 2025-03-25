import { Test, TestingModule } from '@nestjs/testing';
import { HoraireController } from './horaire.controller';
import { HoraireService } from './horaire.service';
import { IHoraireService } from './horaire.service.interface';

describe('HoraireController', () => {
  let controller: HoraireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoraireController],
      providers: [
        {
          provide: IHoraireService,
          useClass: HoraireService,
        },
      ],
    }).compile();

    controller = module.get<HoraireController>(HoraireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
