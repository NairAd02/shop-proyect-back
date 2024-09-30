import { RolEnum } from "../schemas/usuario.schema"

export class UsuarioSerializable {
    id: string
    nombreUsuario: String
    email: String
    rol: RolEnum


    constructor(id: string, nombreUsuario: String, email: String, rol: RolEnum) {
        this.id = id
        this.nombreUsuario = nombreUsuario
        this.email = email
        this.rol = rol
    }
}