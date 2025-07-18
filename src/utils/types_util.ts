import { UserEntity } from "../domain";

export type SignToken = (data: object | string, duration?: number) => Promise<string | null>;
export type Token = <T>(token: string) => Promise<T | null>;
export type Hash = (password: string) => string;
export type CompareHash = (password: string, hash: string) => boolean;
export type UserMapperType = (
  object: { [key: string]: any },
  fielsToDelete?: (keyof UserEntity)[]
) => UserEntity;