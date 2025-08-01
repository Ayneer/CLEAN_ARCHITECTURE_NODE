import express from "express";
import { ErrorControllerHanlder } from "../API/middlewares/error_handler";
import { DataBase } from "../drivers/interfaces/database_interface";
import { ServerInterface } from "./interfaces/server_interface";
import { AppRoutes } from "../API/routes/app_route";

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly errorHandler: any;
  private readonly database: DataBase;

  constructor(options: ServerInterface) {
    const {
      port = 3100,
      errorHandler = new ErrorControllerHanlder().errorHandler,
      database,
    } = options;
    this.port = port;
    this.errorHandler = errorHandler;
    this.database = database;
  }

  async start() {
    await this.database.connect({});

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(AppRoutes.routes);

    this.app.use(this.errorHandler);

    this.app.listen(this.port, () => {
      console.log(`Sever ruuning on port: ${this.port}`);
    });
  }
}
