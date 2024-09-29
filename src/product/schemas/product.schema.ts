import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Product {
    @Prop()
    name: string
    @Prop()
    priceHistory: Array<number> // representa el historial de precios que ha tenido el producto
    @Prop()
    category: number
    @Prop()
    photoURL: string // representa la URL de la imagen que representa al producto
}

export const ProductSchema = SchemaFactory.createForClass(Product)
