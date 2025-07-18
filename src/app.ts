import { Server } from "./presentation/server";
import { AppRoutes } from './API/routes/routes';
import { envs } from './config';
import { FirebaseDatabase } from "./drivers/data";

(() => {
  main();
})();

async function main() {  
  new Server({
    port: envs.PORT,
    database: new FirebaseDatabase(),
  }).start();
}
