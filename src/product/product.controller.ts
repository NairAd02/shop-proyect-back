import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductSerializable } from './serializable/product.serializable';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiBody({ type: CreateProductDto })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponse({ type: [ProductSerializable] })
  async findAll(@Query('name') name: string, @Query('price') price: string, @Query('discount') discount: string,
    @Query('preciodiscount') preciodiscount: string, @Query('averageReview') averageReview: string): Promise<Array<ProductSerializable>> {
    return await this.productService.findAll(name, price ? +price : undefined, discount ? +discount : undefined,
      preciodiscount ? +preciodiscount : undefined, averageReview ? +averageReview : undefined);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ProductSerializable })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: CreateProductDto })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(id, updateProductDto);
  }

  @Post('remove-selected')
  async removeAll(@Body() payload: { listId: Array<string> /* lista con los identificadores de los elmentos que se desean eliminar */ }) {
    console.log(payload.listId)
    return await this.productService.removeAll(payload.listId)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
