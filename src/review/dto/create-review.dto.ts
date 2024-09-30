export class CreateReviewDto {
    idProduct: string
    idUser: string
    punctuation: number // representa la puntación que el usuario decidió darle al producto
    description: string // representa la descrición de la valoración que el usuario le dió al producto
}
