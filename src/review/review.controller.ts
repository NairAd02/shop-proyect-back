import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReviewSerializable } from './serializable/review.serializable';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  @ApiBody({ type: CreateReviewDto })
  public async create(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.create(createReviewDto);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [ReviewSerializable] })
  @Get()
  public async findAll(@Query('idProduct') idProduct: string, @Query('idUser') idUser: string, @Query('punctuation') punctuation: number, @Query('description') description: string) {
    return await this.reviewService.findAll(idProduct, idUser, punctuation ? +punctuation : undefined, description);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ReviewSerializable })
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateReviewDto })
  public async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return await this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return await this.reviewService.remove(id);
  }
}
