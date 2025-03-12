import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED; 

export class JsonWebToken {
  static async generateJWT<T>(data: object | string, duration: number = 2): Promise<T | null>{
    return new Promise((resolve) => {
      jwt.sign(data, JWT_SEED, { expiresIn: duration }, (error, token) => {
        if (error) return resolve(null);
        resolve(token! as T);
      });
    });
  };

  static async validateJWT<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, {}, (error, data) => {
        if (error) return resolve(null);
        resolve(data as T);
      });
    });
  };
}
