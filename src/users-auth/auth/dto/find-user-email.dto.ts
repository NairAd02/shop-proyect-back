import { ApiProperty } from "@nestjs/swagger";

export class FindUserEmailDTO {
    @ApiProperty({ description: 'Email del Usuario' })
    email: string
}