export class FiltersProduct {
    _id?: string
    name?: string | { $regex: string, $options: string }
    price?: number
    discount?: number

    constructor(_id?: string, name?: string | { $regex: string, $options: string }, price?: number, discount?: number) {
        this._id = _id
        this.name = name
        this.price = price
        this.discount = discount
    }
}