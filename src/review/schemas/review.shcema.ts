import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Product } from "src/product/schemas/product.schema";
import { Usuario } from "src/users-auth/usuario/schemas/usuario.schema";

@Schema()
export class Review {
    @Prop()
    idProduct: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
    product: Product // hace referencia al producto al cual se le realizó la reseña
    @Prop()
    idUser: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
    user: Usuario // hace referencia al usuario que realizó la reseña
    @Prop()
    punctuation: number // representa la puntación que el usuario decidió darle al producto
    @Prop()
    description: string // representa la descrición de la valoración que el usuario le dió al producto
}


export const ReviewSchema = SchemaFactory.createForClass(Review)
