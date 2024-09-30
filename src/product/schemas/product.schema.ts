import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose } from "class-transformer";

@Schema()
export class Product {
    @Prop()
    name: string
    @Prop()
    price: number
    @Prop()
    discount: number // si no hay descuento el valor es 0
    @Prop()
    photoURL: string // representa la URL de la imagen que representa al producto
}

export const ProductSchema = SchemaFactory.createForClass(Product)
