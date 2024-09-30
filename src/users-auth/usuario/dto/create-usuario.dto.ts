import { ApiProperty } from "@nestjs/swagger"
import { RolEnum } from "../schemas/usuario.schema"

export class CreateUsuarioDto {
    @ApiProperty({ description: 'Nombre del Usuario' })
    nombreUsuario: string
    @ApiProperty({ description: 'Contraseña del Usuario' })
    contrasena: string
    @ApiProperty({ description: 'Email del Usuario' })
    email: string
    @ApiProperty({ description: 'Rol del Usuario' })
    rol?: RolEnum
    @ApiProperty({ description: 'Propiedad que define si la cuenta del usuario en el momento de su creación será activa o no (para activar la cuenta del súper administrador durante su creación)' })
    isActiva?: boolean
}
