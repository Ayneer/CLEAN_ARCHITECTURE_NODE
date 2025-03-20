export abstract class Dto {
    constructor() { };
    abstract validate<T>(object: { [key: string]: any }): [string?, T?];
}