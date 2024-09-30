import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { UsuarioService } from '../usuario/usuario.service';
import { CodigoActivacionService } from '../codigo-activacion/codigo-activacion.service';
import { MailerService } from '../mailer/mailer.service';
import { LoginDTO } from '../usuario/dto/login-dto';
import { RolEnum } from '../usuario/schemas/usuario.schema';
import { SendEmailDTO } from '../mailer/send-email.dto';
import { CreateCodigoActivacionDTO } from '../codigo-activacion/dto/create-codigo-activacion.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../usuario/dto/update-usuario.dto';
import { codigoVerificacionIdentidadHTML } from '../plantillas/codigo-verificacion-identidad-html';
import { codigoActivacionHTML } from '../plantillas/codigo-activacion-html';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private userService: UsuarioService,
        private jwtService: JwtService,
        private codigoActivacionService: CodigoActivacionService,
        private mailerService: MailerService,
        private configService: ConfigService
    ) { }

    // Metodo para logear un usuario en el sistema
    public async login(loginDTO: LoginDTO) { // retorna el token o en caso de no esta activada la cuenta retorna el identificador del usuario
        const userEntity = await this.userService.findOne(undefined, loginDTO.nombreUsuario) // se obtiene la usuario por su nombre de usuario
        let res: {
            token: string, payload: {
                userId: string,
                rol: RolEnum
            }
        } | undefined = undefined

        // Si fue encontrado el usuario
        if (userEntity) {
            if (await bcrypt.compare(loginDTO.contrasena, userEntity.contrasena.toString())) { // si la contraseña es correcta
                // si ya fue activada la cuenta del usuario
                if (userEntity.isActiva) {
                    if (userEntity.rol) { // si fue asignado un rol al usuario
                        // se crea un payload esto es la información adicional que va a hacer almacenada como parte del token generado
                        const payload = { userId: userEntity._id.toString(), rol: userEntity.rol }
                        // se crea el token
                        const token = await this.jwtService.signAsync(payload) // se crea un token con la información del payload
                        res = { token: token, payload } // se retorna el token junto con el id del usuario
                    }
                    else
                        throw new HttpException("No se le ha asignado un rol al usuario", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
                }
                else {
                    // se le envia al email del usuario un código de activación
                    const codigoActivacion: string = this.generarCodigoActivacion(6).toString()
                    await this.mailerService.sendEmail(new SendEmailDTO([{
                        name: userEntity.nombreUsuario.toString(),
                        address: userEntity.email.toString()
                    }], "Código de Verificación", "Le damos la Bienvenida a los Servicios de Fast-Inspection", codigoActivacionHTML(this.configService.get<string>('NAME_APP'),
                        codigoActivacion,
                        userEntity.nombreUsuario.toString(), this.configService.get<string>('EMAIL_APP')), {
                        name: this.configService.get<string>('NAME_APP'),
                        address: this.configService.get<string>('EMAIL_APP')
                    }))
                    // además se registra el código de activación en la base de datos
                    await this.codigoActivacionService.createCodigoActivacion(new CreateCodigoActivacionDTO(userEntity._id.toString(), codigoActivacion, new Date()))
                    // se indica que el usuario debe de activar la cuenta para completar el logeo
                    return { idUsuario: userEntity._id.toString() } // se retorna el identificador del usuario para poder activar su cuenta
                }
            }
            else
                throw new HttpException("La contrasena es incorrecta", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
        }
        else
            throw new HttpException("El nombre de usuario es incorrecto", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método

        return res
    }

    // Método para activar la cuenta del usuario
    public async activarCuentaUsuario(idUsuario: string, codigoActivacion: string /* representa el código de activación digitado por el usuario */) {
        // se busca al usuario por su identificador
        const usuario = await this.userService.findOne(idUsuario)

        // si fue encontrado el usuario
        if (usuario) {
            // si fue el código de activación es correcto (o sea fue encontrado un código de activación con esos datos)
            await this.verificarCodigoIdentidad(idUsuario, codigoActivacion) // si el método no lanza ninguna exeption, significa que el código de activacion es valido
            // se activa la cuenta del usuario
            usuario.isActiva = true
            // se actualizan los datos en la base de datos
            await usuario.save()
            // se elimina el codigo de activación (opcional ya que cuando se ejecute el escaneo diario cada cierto número de días serán eliminados todos los código obsoletos)
        }
        else
            throw new HttpException("No existe un usuario con ese identificador", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método

    }

    // Método para verificar que un código de identidad sea válido
    public async verificarCodigoIdentidad(idUsuario: string, codigoIdentidad: string) {
        await this.codigoActivacionService.verificarCodigoIdentidad(idUsuario, codigoIdentidad) // si el método no lanza ninguna exeption, significa que el código de activacion es valido
    }

    // Metodo para registrar un usuario en el sistema
    public async registrer(userDTO: CreateUsuarioDto) {
        return await this.userService.create(userDTO) // Se manda a registrar al usuario en la base de datos al servicio de usuarios
    }

    // Método para cambiar la contraseña de un Usuario en específico
    public async cambiarContrasena(idUsuario: string, newContrasena: string, contrasenaAnterior?: string) {
        // si se optó por el método de verificación de contraseña
        // se verifica antes que la contraseña anterior pertenezca realmente al usuario
        // (Para ello, el método "verificarContraseñaUsuario" debe retornar false )
        if (contrasenaAnterior && !(await this.userService.verificarContraseñaUsuario(contrasenaAnterior, idUsuario)))
            throw new HttpException("La contraseña anterior es incorrecta", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
        await this.userService.update(idUsuario, new UpdateUsuarioDto(undefined, newContrasena, undefined) /* solo se modifca la contraseña */)
    }

    // Método para enviar un correo de verificación de identidad 
    public async enviarCorreoVerificacionIdentidad(idUsuario: string /* representa el identificador del usuario al cual se le va a mandar el correo */) {
        // se obtiene el usuario con ese identificador
        const usuario = await this.userService.findOne(idUsuario)

        // si fue encontrado un usuario con ese id
        if (usuario) {
            // se manda un correo con el código de verificación de identidad a ese usuario
            const codigoActivacion: string = this.generarCodigoActivacion(6).toString()

            await this.mailerService.sendEmail(new SendEmailDTO([{
                name: usuario.nombreUsuario.toString(),
                address: usuario.email.toString()
            }], "Código de Verificación", "Le damos la Bienvenida a los Servicios de Shop", codigoVerificacionIdentidadHTML(this.configService.get<string>('NAME_APP'),
                codigoActivacion,
                usuario.nombreUsuario.toString(), this.configService.get<string>('EMAIL_APP')), {
                name: this.configService.get<string>('NAME_APP'),
                address: this.configService.get<string>('EMAIL_APP')
            }))
            // además se registra el código de activación en la base de datos
            await this.codigoActivacionService.createCodigoActivacion(new CreateCodigoActivacionDTO(usuario._id.toString(), codigoActivacion, new Date()))
        }
        else
            throw new HttpException("No existe un usuario con ese identificador", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
    }

    // Método para generar un código de activicación de cuenta
    public generarCodigoActivacion(length: number): String {
        // Genera un código aleatorio en formato hexadecimal y lo recorta al tamaño deseado
        return randomBytes(length).toString('hex').slice(0, length);
    }

}
