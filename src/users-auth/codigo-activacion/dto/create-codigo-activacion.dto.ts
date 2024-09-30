export class CreateCodigoActivacionDTO {
    idUsuario: String
    codigoActivacion: String
    createAt: Date

    constructor(idUsuario: String,
        codigoActivacion: String,
        createAt: Date) {
        this.idUsuario = idUsuario
        this.codigoActivacion = codigoActivacion
        this.createAt = createAt
    }
}