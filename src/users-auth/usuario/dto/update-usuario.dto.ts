
import { RolEnum } from '../schemas/usuario.schema';

export class UpdateUsuarioDto {
    nombreUsuario?: string
    contrasena?: string
    rol?: RolEnum

    constructor(nombreUsuario?: string,
        contrasena?: string,
        rol?: RolEnum) {
        this.nombreUsuario = nombreUsuario
        this.contrasena = contrasena
        this.rol = rol
    }
}
