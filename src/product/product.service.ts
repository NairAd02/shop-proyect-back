import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { FiltersProduct } from './dto/filters-product';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

  async create(createProductDto: CreateProductDto) {
    const product = new this.productModel(createProductDto) // se crea un producto  basado en la información del product dto
    // se asigna el precio al historial de precios del producto
    product.priceHistory.push(createProductDto.price)
    await product.save() // se almacena el producto en la base de datos
  }

  async findAll(nombre?: string, price?: number, category?: number): Promise<Array<Product>> {
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los productos
    const filters: FiltersProduct = new FiltersProduct(undefined, nombre ? { $regex: nombre.toString(), $options: 'i' } : undefined, price, category)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade productos
    const products = await this.productModel.find(filters).exec();

    return products
  }

  async findOne(id: string, nombre?: string, price?: number, category?: number): Promise<Product> {
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los productos
    const filters: FiltersProduct = new FiltersProduct(id, nombre ? { $regex: nombre.toString(), $options: 'i' } : undefined, price, category)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade productos
    const product = await this.productModel.findOne(filters).exec()
  
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    // se busca al producto que se desea actualizar
    const product = await this.productModel.findById(id)
    // si existe un producto con ese id
    if (product) {
      // se actualizan los campos proporcionados para modificar
      if (updateProductDto.name) // si se desea modificar el campo "name"
        product.name = updateProductDto.name
      if (updateProductDto.price && updateProductDto.price !== product.priceHistory[product.priceHistory.length - 1]) // si se desea modificar el campo "price" y el precio a modificar es distinto del último precio registrado
        product.priceHistory.push(updateProductDto.price) // se añade el nuevo precio a la lista que representa el historial de los precios
      if (updateProductDto.category) // si se desea modificar el campo "category"
        product.category = updateProductDto.category
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
    })
  }
}
