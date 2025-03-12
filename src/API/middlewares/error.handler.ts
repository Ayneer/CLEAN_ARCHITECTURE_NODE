import { Request, Response } from "express";
import { ErrorRequestHandler } from "express";
import { CustomError } from "../../domain";

export class ErrorControllerHanlder {
    static errorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
        if (err instanceof CustomError) {
            res.status(err.statusCode).send({ error: err.message });
        }
        throw CustomError.internalServerError();
  };
}
