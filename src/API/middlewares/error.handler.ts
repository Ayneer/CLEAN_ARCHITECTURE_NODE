import { Request, Response, ErrorRequestHandler } from "express";
import { CustomError } from "../../config";

export class ErrorControllerHanlder {

    errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next) => {
        if (err instanceof CustomError) {
            res.status(err.statusCode).send({ error: err.message });
        } else if (err && err.message) {
            //logger error
            console.error('error handler:', err.message)
            throw CustomError.internalServerError();
        }
        next();
    };

}
