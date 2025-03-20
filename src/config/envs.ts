import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    ROOT_USER_NAME: get('ROOT_USER_NAME').required().asString(),
    ROOT_USER_EMAIL: get('ROOT_USER_EMAIL').required().asString(),
    ROOT_USER_PASSWORD: get('ROOT_USER_PASSWORD').required().asString(),
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString()
}