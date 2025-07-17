import express, { Router } from "express";
import { ErrorControllerHanlder } from "../API/middlewares/error.handler";
import { envs } from "../config";

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly errorHandler: any;
  private readonly database: DataBase;

  constructor(options: ServerInterface) {
    const {
      port = 3100,
      routes,
      errorHandler = new ErrorControllerHanlder().errorHandler,
      database,
    } = options;
    this.port = port;
    this.routes = routes;
    this.errorHandler = errorHandler;
    this.database = database;
  }

  async start() {
    await this.database.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
      rootUserEmail: envs.ROOT_USER_EMAIL,
      rootUserName: envs.ROOT_USER_NAME,
      rootUserPassword: envs.ROOT_USER_PASSWORD,
    });

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(this.routes);

    this.app.use(this.errorHandler);

    this.app.listen(this.port, () => {
      console.log(`Sever ruuning on port: ${this.port}`);
    });
  }
}
