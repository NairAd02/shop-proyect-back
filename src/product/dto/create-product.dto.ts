import { ApiProperty } from "@nestjs/swagger"

export class CreateProductDto {
    @ApiProperty({ description: 'Nombre del producto' })
    name: string
    @ApiProperty({ description: 'Precio del producto' })
    price: number // cuando se crea un producto se crea con un precio base (luego las modificaciones sobre el se guardaran en un registro)
    @ApiProperty({ description: 'Descuento del precio que puede tener el producto' })
    discount: number
    @ApiProperty({ description: 'URL que define la ruta del servidor donde será almacenada la imagen que referencia al producto' })
    photoURL: string // representa la URL de la imagen que representa al producto
}
