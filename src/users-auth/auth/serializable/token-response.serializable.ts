import { ApiProperty } from "@nestjs/swagger";
import { RolEnum } from "src/users-auth/usuario/schemas/usuario.schema";

class PayloadToken {
    @ApiProperty({ description: 'Representa el Identificador del Usuario que se logeo' })
    userId: string;
    @ApiProperty({ description: 'Representa el Rol del Usuario que se logeo' })
    rol: RolEnum;
}

export class TokenResponseSerializable {
    @ApiProperty({ description: 'Representa el Token generaedo' })
    token: string;
    @ApiProperty({ description: 'Representa la información adicional que se envía junto al token' })
    payload: PayloadToken
}



export class LoginResponseSerializable {
    @ApiProperty({ description: 'Representa el Identificador del Usuario que se logeo' })
    idUsuario: string;
}