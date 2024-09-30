import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class CodigoActivacion {
    @Prop()
    idUsuario: string
    @Prop()
    codigoActivacion: string
    @Prop()
    createAt: Date

}

export const CodigoActivacionSchema = SchemaFactory.createForClass(CodigoActivacion)