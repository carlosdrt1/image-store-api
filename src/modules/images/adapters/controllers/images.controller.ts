import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';
import { ImageInput } from '../../application/dto/image-input.dto';
import { AuthGuard } from 'src/modules/auth/adapters/guards/auth.guard';
import { RequestAuth } from 'src/modules/auth/adapters/types/request-auth.type';

@Controller('images')
export class ImagesController {
  constructor(private readonly uploadImageUseCase: UploadImageUseCase) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  async uploadImage(@Req() req: RequestAuth) {
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
}
