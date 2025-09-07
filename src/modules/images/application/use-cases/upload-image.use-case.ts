import { BadRequestException, Injectable } from '@nestjs/common';
import { Image } from '../../domain/image.entity';
import { ImageRepository } from '../../domain/image.repository.abstract';
import { ImageInput } from '../dto/image-input.dto';
import { v7 as uuidv7 } from 'uuid';
import { isValidMimeType } from '../../domain/image-mimetype.enum';
import { StorageProvider } from '../../domain/providers/storage.provider.abstract';

@Injectable()
export class UploadImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(dto: ImageInput): Promise<Image> {
    if (!isValidMimeType(dto.mimeType)) {
      throw new BadRequestException('The file must be an image');
    }

    const image = new Image(
      uuidv7(),
      dto.userId,
      dto.originalName,
      dto.mimeType,
    );

    const uploadedImage = await this.storageProvider.upload(image, dto.stream);

    return this.imageRepository.create(uploadedImage);
  }
}
