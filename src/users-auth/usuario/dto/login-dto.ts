import { ApiProperty } from "@nestjs/swagger"

// Representa los atributos que se pasan durante el logeo
export class LoginDTO {
    @ApiProperty({ description: 'Nombre del Usuario' })
    nombreUsuario: string
    @ApiProperty({ description: 'Contraseña del Usuario' })
    contrasena: string
}