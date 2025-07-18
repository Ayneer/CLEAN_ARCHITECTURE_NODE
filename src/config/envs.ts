import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    ROOT_USER_NAME: get('ROOT_USER_NAME').required().asString(),
    ROOT_USER_EMAIL: get('ROOT_USER_EMAIL').required().asString(),
    ROOT_USER_PASSWORD: get('ROOT_USER_PASSWORD').required().asString(),
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),
    FIREBASE_API_KEY: get('FIREBASE_API_KEY').required().asString(),
    FIREBASE_AUTH_DOMAIN: get('FIREBASE_AUTH_DOMAIN').required().asString(),
    FIREBASE_PROJECT_ID: get('FIREBASE_PROJECT_ID').required().asString(),
    FIREBASE_STORAGE_BUCKET: get('FIREBASE_STORAGE_BUCKET').required().asString(),
    FIREBASE_MESSAGING_SENDER_ID: get('FIREBASE_MESSAGING_SENDER_ID').required().asString(),
    FIREBASE_APP_ID: get('FIREBASE_APP_ID').required().asString(),
    FIREBASE_MEASUREMENT_ID: get('FIREBASE_MEASUREMENT_ID').required().asString(),
}