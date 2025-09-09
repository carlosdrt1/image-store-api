import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { StorageProvider } from '../../domain/providers/storage.provider.abstract';

@Injectable()
export class RemoveImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(name: string, userId: string): Promise<void> {
    const image = await this.imageRepository.findByName(name, userId);

    if (!image) {
      throw new NotFoundException('image not found');
    }

    await Promise.all([
      this.storageProvider.remove(image.getKey()!),
      this.imageRepository.remove(image.getId()),
    ]);
  }
}
