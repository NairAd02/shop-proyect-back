import { Module } from '@nestjs/common';
import { CodigoActivacionService } from './codigo-activacion.service';
import { CodigoActivacionController } from './codigo-activacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CodigoActivacion, CodigoActivacionSchema } from './schemas/codigo-activacion.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: CodigoActivacion.name,
      schema: CodigoActivacionSchema
    }
  ])],
  controllers: [CodigoActivacionController],
  providers: [CodigoActivacionService],
  exports: [CodigoActivacionService]
})
export class CodigoActivacionModule { }
