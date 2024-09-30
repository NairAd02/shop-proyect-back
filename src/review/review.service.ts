import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.shcema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewSerializable } from './serializable/review.serializable';
import { FiltersReview } from './dto/filters-review';
import { ProductSerializable } from 'src/product/serializable/product.serializable';
import { UsuarioSerializable } from 'src/users-auth/usuario/dto/usuario.serializable';

@Injectable()
export class ReviewService {

  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) { }

  public async create(createReviewDto: CreateReviewDto) {
    // se crea una review  basado en la información del product dto
    const review = new this.reviewModel({
      idProduct: createReviewDto.idProduct,
      product: {
        _id: createReviewDto.idProduct
      },
      idUser: createReviewDto.idUser,
      user: {
        _id: createReviewDto.idUser
      },
      punctuation: createReviewDto.punctuation,
      description: createReviewDto.description
    })

    await review.save() // se almacena la review en la base de datos
  }

  public async findAll(idProduct?: string, idUser?: string, punctuation?: number, description?: string): Promise<Array<ReviewSerializable>> {
    const reviewsSerializables = new Array<ReviewSerializable>()
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de las reviews
    const filters: FiltersReview = new FiltersReview(undefined, idProduct, idUser, punctuation,
      description ? { $regex: description.toString(), $options: 'i' } : undefined)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade productos
    const reviews = await this.reviewModel.find(filters).populate('product').populate('user').exec();

    for (let index = 0; index < reviews.length; index++) {
      const review = reviews[index];
      reviewsSerializables.push(new ReviewSerializable(review._id.toString(), new ProductSerializable(review.idProduct, review.product.name, review.product.price,
        review.product.discount, review.product.photoURL, await this.findAllWithOutRelations(review.idProduct)), new UsuarioSerializable(review.idUser, review.user.nombreUsuario, review.user.email, review.user.rol),
        review.punctuation, review.description))
    }

    return reviewsSerializables
  }

  public async findAllWithOutRelations(idProduct?: string, idUser?: string, punctuation?: number, description?: string): Promise<Array<ReviewSerializable>> {
    const reviewsSerializables = new Array<ReviewSerializable>()
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de las reviews
    const filters: FiltersReview = new FiltersReview(undefined, idProduct, idUser, punctuation,
      description ? { $regex: description.toString(), $options: 'i' } : undefined)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade productos
    const reviews = await this.reviewModel.find(filters).populate('product').populate('user').exec();

    reviews.forEach((review) => {
      reviewsSerializables.push(new ReviewSerializable(review._id.toString(), new ProductSerializable(review.idProduct, review.product.name, review.product.price,
        review.product.discount, review.product.photoURL), new UsuarioSerializable(review.idUser, review.user.nombreUsuario, review.user.email, review.user.rol),
        review.punctuation, review.description))
    })

    return reviewsSerializables
  }

  public async findOne(idReview: string, idProduct?: string, idUser?: string, punctuation?: number, description?: string): Promise<ReviewSerializable | undefined> {
    let reviewSerializable: ReviewSerializable | undefined = undefined
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de las reviews
    const filters: FiltersReview = new FiltersReview(idReview, idProduct, idUser, punctuation,
      description ? { $regex: description.toString(), $options: 'i' } : undefined)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade productos
    const review = await this.reviewModel.findOne(filters).exec();

    // si fue encontrado alguna review con esos filtros
    if (review) {
      reviewSerializable = new ReviewSerializable(review._id.toString(), new ProductSerializable(review.idProduct, review.product.name, review.product.price,
        review.product.discount, review.product.photoURL), new UsuarioSerializable(review.idUser, review.user.nombreUsuario, review.user.email, review.user.rol),
        review.punctuation, review.description)
    }
    else
      throw new BadRequestException('No se encontró una review con esos filtros')



    return reviewSerializable
  }

  public async update(id: string, updateReviewDto: UpdateReviewDto) {
    return await this.reviewModel.updateOne({
      _id: id
    }, updateReviewDto)
  }

  public async remove(id: string) {
    return await this.reviewModel.deleteOne({
      _id: id
    })
  }
}
