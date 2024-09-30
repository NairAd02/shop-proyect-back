export class FiltersReview {
    _id?: string
    idProduct?: string
    idUser?: string
    punctuation?: number // representa la puntación que el usuario decidió darle al producto
    description?: string | { $regex: string, $options: string } // representa la descrición de la valoración que el usuario le dió al producto

    constructor(_id?: string, idProduct?: string, idUser?: string, punctuation?: number, description?: string | { $regex: string, $options: string }) {
        this._id = _id
        this.idProduct = idProduct
        this.idUser = idUser
        this.punctuation = punctuation
        this.description = description
    }
}