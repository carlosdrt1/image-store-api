import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { Image } from '../../domain/entities/image.entity';
import { FindImagesInput } from '../dto/find-images-input.dto';

@Injectable()
export class FindImagesUseCase {
  constructor(private readonly imageRepository: ImageRepository) {}

  async execute(
    dto: FindImagesInput,
  ): Promise<{ page: number; limit: number; data: Image[] }> {
    const { page = 1, limit = 10, name } = dto;

    const images = await this.imageRepository.findAllByUser(
      dto.userId,
      limit,
      page,
      name,
    );

    return { page, limit, data: images };
  }
}
