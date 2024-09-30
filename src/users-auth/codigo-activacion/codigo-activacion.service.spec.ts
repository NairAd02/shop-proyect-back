import { Test, TestingModule } from '@nestjs/testing';
import { CodigoActivacionService } from './codigo-activacion.service';

describe('CodigoActivacionService', () => {
  let service: CodigoActivacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodigoActivacionService],
    }).compile();

    service = module.get<CodigoActivacionService>(CodigoActivacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
