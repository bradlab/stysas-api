import { Test, TestingModule } from '@nestjs/testing';
import { EntraineurController } from './entraineur.controller';
import { EntraineurService } from './entraineur.service';
import { IEntraineurService } from './entraineur.service.interface';

describe('EntraineurController', () => {
  let controller: EntraineurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntraineurController],
      providers: [
        {
          provide: IEntraineurService,
          useClass: EntraineurService,
        },
      ],
    }).compile();

    controller = module.get<EntraineurController>(EntraineurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
