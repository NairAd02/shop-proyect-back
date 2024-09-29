export class CreateProductDto {
    name: string
    price: number // cuando se crea un producto se crea con un precio base (luego las modificaciones sobre el se guardaran en un registro)
    category: number
    photoURL: string // representa la URL de la imagen que representa al producto
}
