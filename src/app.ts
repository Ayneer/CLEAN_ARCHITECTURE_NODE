import { Server } from "./presentation/server";
import { AppRoutes } from './API/routes/routes';
import { envs, JsonWebToken } from './config';
import { MongoDatabase } from "./drivers/data";

(() => {
  main();
})();

async function main() {

  await new MongoDatabase().connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
    rootUserEmail: envs.ROOT_USER_EMAIL,
    rootUserName: envs.ROOT_USER_NAME,
    rootUserPassword: envs.ROOT_USER_PASSWORD
  });

  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();
}
