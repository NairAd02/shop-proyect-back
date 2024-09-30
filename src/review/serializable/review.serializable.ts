import { ProductSerializable } from "src/product/serializable/product.serializable"
import { UsuarioSerializable } from "src/users-auth/usuario/dto/usuario.serializable"

export class ReviewSerializable {
    id: string
    product: ProductSerializable
    user: UsuarioSerializable
    punctuation: number // representa la puntación que el usuario decidió darle al producto
    description: string // representa la descrición de la valoración que el usuario le dió al producto

    constructor(id: string, product: ProductSerializable, user: UsuarioSerializable, punctuation: number, description: string) {
        this.id = id
        this.product = product
        this.user = user
        this.punctuation = punctuation
        this.description = description
    }
}