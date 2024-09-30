import { ApiProperty } from "@nestjs/swagger"
import { ProductSerializable } from "src/product/serializable/product.serializable"
import { UsuarioSerializable } from "src/users-auth/usuario/dto/usuario.serializable"

export class ReviewSerializable {
    @ApiProperty({ description: 'Identificador único de la reseña' })
    id: string
    @ApiProperty({ description: 'Producto al cual se le va a realizar la reseña' })
    product: ProductSerializable
    @ApiProperty({ description: 'Usuario que realizará la reseña' })
    user: UsuarioSerializable
    @ApiProperty({ description: 'Puntuación que decidió otorgarle el usuario al producto' })
    punctuation: number // representa la puntación que el usuario decidió darle al producto
    @ApiProperty({ description: 'Descripción que le usuario decidió añadirle a la reseña' })
    description: string // representa la descrición de la valoración que el usuario le dió al producto

    constructor(id: string, product: ProductSerializable, user: UsuarioSerializable, punctuation: number, description: string) {
        this.id = id
        this.product = product
        this.user = user
        this.punctuation = punctuation
        this.description = description
    }
}