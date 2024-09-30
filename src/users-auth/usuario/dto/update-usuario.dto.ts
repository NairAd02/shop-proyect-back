
import { ApiProperty } from '@nestjs/swagger';
import { RolEnum } from '../schemas/usuario.schema';

export class UpdateUsuarioDto {
    @ApiProperty({ description: 'Nombre del Usuario' })
    nombreUsuario?: string
    @ApiProperty({ description: 'Contraseña del Usuario' })
    contrasena?: string
    @ApiProperty({ description: 'Rol del Usuario' })
    rol?: RolEnum

    constructor(nombreUsuario?: string,
        contrasena?: string,
        rol?: RolEnum) {
        this.nombreUsuario = nombreUsuario
        this.contrasena = contrasena
        this.rol = rol
    }
}
