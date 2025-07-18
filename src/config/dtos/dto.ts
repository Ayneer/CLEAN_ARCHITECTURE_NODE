export abstract class Dto<T> {
  abstract validate(object: { [key: string]: any }): [string?, string?, T?];
}
