export interface DataBase {
  connect: (options?: any) => Promise<void>;
}
