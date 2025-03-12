import { Server } from "./presentation/server";
import { AppRoutes } from './API/routes/routes';
import { envs } from './config';

(() => {
  main();
})();

async function main() {

  // await MongoDatabase.connect({
  //   dbName: envs.MONGO_DB_NAME,
  //   mongoUrl: envs.MONGO_URL
  // });

  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  }).start();
}
