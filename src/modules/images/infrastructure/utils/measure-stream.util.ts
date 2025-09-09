import { PassThrough } from 'stream';

export const measureStream = (stream: NodeJS.ReadableStream) => {
  let size = 0;
  const counter = new PassThrough();

  stream.on('data', (chunk) => {
    size += (chunk as Buffer).length;
  });

  stream.pipe(counter);

  return { stream: counter, getSize: () => size };
};
