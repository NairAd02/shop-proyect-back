import { RolEnum } from "../schemas/usuario.schema"

export class FiltersUsuarioDTO {
    _id?: string
    nombreUsuario?: String | { $regex: string, $options: string }
    email?: String | { $regex: string, $options: string }
    rol?: RolEnum
    idSolicitante?: String

    constructor(id?: string, nombreUsuario?: String | { $regex: string, $options: string }, 
        email?: String | { $regex: string, $options: string }, rol?: RolEnum, idSolicitante?: String) {
        this._id = id
        this.nombreUsuario = nombreUsuario
        this.email = email
        this.rol = rol
        this.idSolicitante = idSolicitante
    }
}