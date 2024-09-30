export class FiltersCodigoActivacionDTO {
    _id: string
    idUsuario: string
    codigoActivacion: string

    constructor(_id: string, idUsuario: string, codigoActivacion: string) {
        this._id = _id
        this.idUsuario = idUsuario
        this.codigoActivacion = codigoActivacion
    }
}