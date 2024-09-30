import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCodigoActivacionDTO } from './dto/create-codigo-activacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CodigoActivacion } from './schemas/codigo-activacion.schema';
import { Model } from 'mongoose';
import { FiltersCodigoActivacionDTO } from './dto/filters-codigo-activacion.dt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CodigoActivacionService {
    constructor(@InjectModel(CodigoActivacion.name) private codigoActivacionModel: Model<CodigoActivacion>, private configService: ConfigService) { }

    public async createCodigoActivacion(codigoActivacionDTO: CreateCodigoActivacionDTO) {
        const codigoActivacion = new this.codigoActivacionModel(codigoActivacionDTO) // se crea un codigo de activacion  basado en la información del codigo de activacion dto

        // se inserta el codigo de activación en la base de datos
        await codigoActivacion.save()
    }

    public async findOne(idCodigoActivacion?: string, idUsuario?: string, codigoActivacion?: string) {
        const filters: FiltersCodigoActivacionDTO = new FiltersCodigoActivacionDTO(idCodigoActivacion, idUsuario, codigoActivacion)
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

        return await this.codigoActivacionModel.findOne(filters).exec()
    }

    public async deleteCodigoActivacion(idCodigoActivacion: string) {
        await this.codigoActivacionModel.deleteOne({ _id: idCodigoActivacion }).exec()
    }

    // Método para verificar el código de activación de un usuario
    public async verificarCodigoIdentidad(idUsuario: string, codigoVerificacion: string) {
        // se busca un código de verificación con ese código para ese usuario
        const codigoVerificacionRegistro = await this.findOne(undefined, idUsuario, codigoVerificacion)

        // si no fue encontrado código de verificación
        if (!codigoVerificacionRegistro)
            throw new HttpException("Código de Activación incorrecto", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método

        // si el código de verificación expiró
        if (new Date().getTime() - codigoVerificacionRegistro.createAt.getTime() >= parseInt(this.configService.get<string>('EXPIRATION_TIME')))
            throw new HttpException("Este código de activación a expirado", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método

        // si no sucede nada de lo anterior, el código de verificación es válido
    }

}
