import express, { Router } from "express";
import { ErrorControllerHanlder } from "../API/middlewares/error.handler";

interface Options {
  port?: number;
  routes: Router;
  errorHandler?: any;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly errorHandler: any;

  constructor(options: Options) {
    const {
      port = 3100,
      routes,
      errorHandler = ErrorControllerHanlder.errorHandler,
    } = options;
    this.port = port;
    this.routes = routes;
    this.errorHandler = errorHandler;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(this.routes);

    this.app.use(this.errorHandler);

    this.app.listen(this.port, () => {
      console.log(`Sever ruuning on port: ${this.port}`);
    });
  }
}
