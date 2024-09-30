import { Test, TestingModule } from '@nestjs/testing';
import { CodigoActivacionController } from './codigo-activacion.controller';
import { CodigoActivacionService } from './codigo-activacion.service';

describe('CodigoActivacionController', () => {
  let controller: CodigoActivacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodigoActivacionController],
      providers: [CodigoActivacionService],
    }).compile();

    controller = module.get<CodigoActivacionController>(CodigoActivacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
