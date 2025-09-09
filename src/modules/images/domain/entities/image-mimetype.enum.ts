export enum ImageMimeType {
  JPG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}

export function isValidMimeType(mimetype: string): mimetype is ImageMimeType {
  return Object.values(ImageMimeType).includes(mimetype as ImageMimeType);
}
