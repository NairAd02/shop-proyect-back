import { ApiProperty } from "@nestjs/swagger"

export class ChangePasswordDTO {
    @ApiProperty({ description: 'Nueva Contraseña del Usuario' })
    newContrasena: string
    @ApiProperty({ description: 'Contraseña Anterior del Usuario' })
    contrasenaAnterior?: string
}