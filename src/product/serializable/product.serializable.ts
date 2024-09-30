import { Exclude, Expose } from "class-transformer";
import { ReviewSerializable } from "src/review/serializable/review.serializable";

export class ProductSerializable {
    id: string
    name: string
    price: number
    discount: number // si no hay discount el valor es 0
    photoURL: string // representa la URL de la imagen que representa al producto
    @Exclude() // no es necesario incluir todas las reseñas hechas al producto
    reviews?: Array<ReviewSerializable>

    constructor(id: string,
        name: string,
        price: number,
        discount: number, // si no hay discount el valor es 0
        photoURL: string, // representa la URL de la imagen que representa al producto) {
        reviews?: Array<ReviewSerializable>
    ) {
        this.id = id
        this.name = name
        this.price = price
        this.discount = discount
        this.photoURL = photoURL
        this.reviews = reviews
    }

    // Método para calcular el discount
    @Expose()
    public preciodiscount(): number {
        return this.discount !== 0 ? this.price - (this.price * this.discount) : this.price
    }
    // Método para determinar la reseña promedio del producto
    @Expose()
    public averageReview(): number {
        let average = 0
        // si la cantidad de reviews es distinta de 0
        if (this.reviews.length !== 0) {
            let suma = 0 // representa la suma de las puntuaciones
            // se calcula la suma de las puntuaciones
            this.reviews.forEach((review) => {
                suma += review.punctuation
            })
            // se determina el average de esas puntuaciones
            average = suma / this.reviews.length
        }

        return average
    }

}