import { Request } from "express";
import { RolEnum } from "../usuario/schemas/usuario.schema";


export interface RequestWithUser extends Request {
    user: {
        userId: number,
        rol: RolEnum
    }
}