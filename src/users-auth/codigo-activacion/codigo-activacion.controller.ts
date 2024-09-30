import { Controller } from '@nestjs/common';
import { CodigoActivacionService } from './codigo-activacion.service';

@Controller('codigo-activacion')
export class CodigoActivacionController {
  constructor(private readonly codigoActivacionService: CodigoActivacionService) {}
}
