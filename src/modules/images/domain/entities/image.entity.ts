import { ImageMimeType } from './image-mimetype.enum';

export class Image {
  private readonly uploadedAt: Date;

  constructor(
    private readonly id: string,
    private readonly userId: string,
    private originalName: string,
    private mimetype: ImageMimeType,
    private key?: string,
    private size?: number,
    private url?: string,
    uploadedAt?: Date,
  ) {
    this.uploadedAt = uploadedAt ?? new Date();
  }

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getOriginalName() {
    return this.originalName;
  }

  getKey() {
    return this.key;
  }

  getUrl() {
    return this.url;
  }

  getMimeType() {
    return this.mimetype;
  }

  getSize() {
    return this.size;
  }

  getUploadedAt() {
    return this.uploadedAt;
  }

  public toStorage(url: string, size: number, key: string) {
    if (size <= 0) {
      throw new Error('Invalid image size');
    }

    this.url = url;
    this.size = size;
    this.key = key;
  }
}
