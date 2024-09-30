import { ApiProperty } from "@nestjs/swagger"
import { RolEnum } from "../schemas/usuario.schema"

export class UsuarioSerializable {
    @ApiProperty({ description: 'Indentificador único del Usuario' })
    id: string
    @ApiProperty({ description: 'Nombre del Usuario' })
    nombreUsuario: String
    @ApiProperty({ description: 'Email del Usuario' })
    email: String
    @ApiProperty({ description: 'Rol del Usuario' })
    rol: RolEnum


    constructor(id: string, nombreUsuario: String, email: String, rol: RolEnum) {
        this.id = id
        this.nombreUsuario = nombreUsuario
        this.email = email
        this.rol = rol
    }
}