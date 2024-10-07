
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";


// Se define el enum de los roles de usuario

export enum RolEnum {
    SuperAdministrador = "Súper Administrador",
    Administrador = "Administrador",
    Trabajador = "Trabajador",
    Cliente = "Cliente"
}

@Schema()
export class Usuario {
    @Prop()
    nombreUsuario: String
    @Prop()
    @Exclude()
    contrasena: String
    @Prop()
    email: String
    @Prop()
    rol: RolEnum
    @Prop()
    isActiva: boolean // define si la cuenta ha sido activada o no
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)
