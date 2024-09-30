import { ApiProperty } from "@nestjs/swagger"


export class UpdateReviewDto {
    @ApiProperty({ description: 'Puntuación que decidió otorgarle el usuario al producto' })
    punctuation: number // representa la puntación que el usuario decidió darle al producto
    @ApiProperty({ description: 'Descripción que le usuario decidió añadirle a la reseña' })
    description: string // representa la descrición de la valoración que el usuario le dió al producto
}
