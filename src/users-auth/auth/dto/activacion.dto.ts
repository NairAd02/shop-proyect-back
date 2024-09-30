import { ApiProperty } from "@nestjs/swagger"


export class ActivacionDTO {
    @ApiProperty({ description: 'Indentificador único del Usuario' })
    idUsuario: string
    @ApiProperty({ description: 'Código de Activación del Usuario' })
    codigoActivacion: string
}