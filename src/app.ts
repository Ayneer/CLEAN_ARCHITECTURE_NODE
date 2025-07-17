import { Server } from "./presentation/server";
import { AppRoutes } from './API/routes/routes';
import { envs } from './config';
import { MongoDatabase } from "./drivers/data";

(() => {
  main();
})();

async function main() {
  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
    database: new MongoDatabase(),
  }).start();
}
