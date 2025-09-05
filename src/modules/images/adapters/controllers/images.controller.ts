import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';
import { ImageInput } from '../../application/dto/image-input.dto';
import { AuthGuard } from 'src/modules/auth/adapters/guards/auth.guard';
import { RequestAuth } from 'src/modules/auth/adapters/types/request-auth.type';
import { Image } from '../../domain/image.entity';
import { ImagesQueryDto } from '../dto/images-query.dto';
import { FindImagesUseCase } from '../../application/use-cases/find-images.use-case';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly findImagesUseCase: FindImagesUseCase,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  async uploadImage(@Req() req: RequestAuth): Promise<Image> {
    const data = await req.file();

    if (!data) throw new BadRequestException();

    const imageInput: ImageInput = {
      userId: req.user.id,
      originalName: data.filename,
      mimeType: data.mimetype,
      stream: data.file,
    };

    return this.uploadImageUseCase.execute(imageInput);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() query: ImagesQueryDto, @Req() req: RequestAuth) {
    return this.findImagesUseCase.execute({ userId: req.user.id, ...query });
  }
}
