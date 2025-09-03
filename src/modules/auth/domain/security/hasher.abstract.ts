export abstract class Hasher {
  abstract hash(text: string): Promise<string>;
  abstract verify(hashed: string, text: string): Promise<boolean>;
}
