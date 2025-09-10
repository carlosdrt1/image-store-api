import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';
import { ImageInput } from '../../application/dto/image-input.dto';
import { AuthGuard } from 'src/modules/auth/adapters/guards/auth.guard';
import { RequestAuth } from 'src/modules/auth/adapters/types/request-auth.type';
import { Image } from '../../domain/entities/image.entity';
import { ImagesQueryDto } from '../dto/images-query.dto';
import { FindImagesUseCase } from '../../application/use-cases/find-images.use-case';
import { RemoveImageUseCase } from '../../application/use-cases/remove-image.use-case';
import { ExportImagesToCsvUseCase } from '../../application/use-cases/export-images-to-csv.use-case';
import { v7 as uuidv7 } from 'uuid';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly findImagesUseCase: FindImagesUseCase,
    private readonly removeImageUseCase: RemoveImageUseCase,
    private readonly exportImagesToCsvUseCase: ExportImagesToCsvUseCase,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  async uploadImage(@Req() req: RequestAuth): Promise<Image> {
    const data = await req.file();

    if (!data) throw new BadRequestException('image not uploaded');

    const imageInput: ImageInput = {
      originalName: data.filename,
      mimeType: data.mimetype,
      stream: data.file,
    };

    return this.uploadImageUseCase.execute(imageInput, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: ImagesQueryDto,
    @Req() req: RequestAuth,
  ): Promise<{ page: number; limit: number; data: Image[] }> {
    return this.findImagesUseCase.execute(query, req.user.id);
  }

  @Get('export-csv')
  @UseGuards(AuthGuard)
  async exportToCsv(
    @Req() req: RequestAuth,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<void> {
    const csvData = await this.exportImagesToCsvUseCase.execute(req.user.id);

    reply
      .header('Content-Type', 'text/csv')
      .header(
        'Content-Disposition',
        `attachment; filename="images-${uuidv7()}.csv"`,
      )
      .send(csvData);
  }

  @HttpCode(204)
  @Delete(':name')
  @UseGuards(AuthGuard)
  async remove(
    @Param('name') name: string,
    @Req() req: RequestAuth,
  ): Promise<void> {
    return this.removeImageUseCase.execute(name, req.user.id);
  }
}
