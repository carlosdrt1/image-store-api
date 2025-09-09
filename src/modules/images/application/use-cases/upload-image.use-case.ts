import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Image } from '../../domain/entities/image.entity';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { ImageInput } from '../dto/image-input.dto';
import { v7 as uuidv7 } from 'uuid';
import { isValidMimeType } from '../../domain/entities/image-mimetype.enum';
import { StorageProvider } from '../../domain/providers/storage.provider.abstract';

@Injectable()
export class UploadImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(dto: ImageInput, userId: string): Promise<Image> {
    if (!isValidMimeType(dto.mimeType)) {
      throw new BadRequestException('The file must be an image');
    }

    const imageExists = await this.imageRepository.findByName(
      dto.originalName,
      userId,
    );

    if (imageExists) {
      throw new ConflictException('An image with this name already');
    }

    const image = new Image(uuidv7(), userId, dto.originalName, dto.mimeType);
    const uploadedImage = await this.storageProvider.upload(image, dto.stream);

    return this.imageRepository.create(uploadedImage);
  }
}
