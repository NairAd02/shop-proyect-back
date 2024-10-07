import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { FiltersProduct } from './dto/filters-product';
import { ProductSerializable } from './serializable/product.serializable';
import { ReviewService } from 'src/review/review.service';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>, private reviewService: ReviewService) { }

  async create(createProductDto: CreateProductDto) {
    const product = new this.productModel(createProductDto) // se crea un producto  basado en la información del product dto

    await product.save() // se almacena el producto en la base de datos
  }

  async findAll(nombre?: string, price?: number, discount?: number,
    preciodiscount?: number, averageReview?: number): Promise<Array<ProductSerializable>> {
    const productSerializables = new Array<ProductSerializable>()
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los productos
    const filters: FiltersProduct = new FiltersProduct(undefined, nombre ? { $regex: nombre.toString(), $options: 'i' } : undefined, price, discount)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade productos
    const products = await this.productModel.find(filters).exec();

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      // se construye un product serializable
      const productSerializable = new ProductSerializable(product._id.toString(), product.name, product.price, product.discount, product.photoURL,
        await this.reviewService.findAllWithOutRelations(product._id.toString()))
      // si el producto cumple con los filtros de las propiedades calculables
      if ((!preciodiscount || productSerializable.preciodiscount === preciodiscount) && (!averageReview || productSerializable.averageReview === averageReview))
        productSerializables.push(productSerializable)
    }

    return productSerializables
  }

  async findOne(id: string, nombre?: string, price?: number, category?: number): Promise<ProductSerializable | undefined> {
    let productSerializable: ProductSerializable | undefined = undefined
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los productos
    const filters: FiltersProduct = new FiltersProduct(id, nombre ? { $regex: nombre.toString(), $options: 'i' } : undefined, price, category)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade productos
    const product = await this.productModel.findOne(filters).exec()

    // si fue encontrado un producto con esos filtros
    if (product) {
      productSerializable = new ProductSerializable(product._id.toString(), product.name, product.price, product.discount, product.photoURL,
        await this.reviewService.findAllWithOutRelations(product._id.toString()))
    }
    else
      throw new BadRequestException('No fue encontrado un producto con esos filtros')

    return productSerializable
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    // se busca al producto que se desea actualizar
    const product = await this.productModel.findById(id)
    // si existe un producto con ese id
    if (product) {
      // se actualizan los campos proporcionados para modificar
      if (updateProductDto.name) // si se desea modificar el campo "name"
        product.name = updateProductDto.name
      if (updateProductDto.price) // si se desea modificar el campo "price" y el precio a modificar es distinto del último precio registrado
        product.price = updateProductDto.price
      if (updateProductDto.discount) // si se desea modificar el campo "descuento"
        product.discount = updateProductDto.discount
      if (updateProductDto.photoURL) // si se desea modificar el campo "photoURL"
        product.photoURL = updateProductDto.photoURL

      // por último se actualizan los datos del product que hayan podido ser modificados en la base de datos
      await product.save()
    }
    else
      throw new BadRequestException('No existe un producto con ese identificador')
  }

  async remove(id: string) {
    return await this.productModel.deleteOne({
      _id: id
    }).exec()
  }

  async removeAll(listId: Array<string>) {
    for (let index = 0; index < listId.length; index++) {
      // se elimina uno a uno cada producto
      const id: string = listId[index]
      await this.productModel.deleteOne({
        _id: id
      }).exec()
    }
  }
}
