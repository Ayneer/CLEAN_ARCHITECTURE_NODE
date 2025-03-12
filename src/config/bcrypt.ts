import { hashSync, compareSync } from "bcryptjs";

export class BcryptAdapter {
  static generateBcryptHash = (text: string): string => {
    return hashSync(text);
  };

  static compareBcryptHash = (text: string, hash: string): boolean => {
    return compareSync(text, hash);
  };
}
