export interface UseCaseInterface<T, K> {
  excecute(data: T): Promise<K>;
}