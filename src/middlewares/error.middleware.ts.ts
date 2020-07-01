import { Response, NextFunction, Request } from "express";
import { ApplicationError } from "common";
import { ErrorRequestHandler } from "express-serve-static-core";
export const ErrorMiddleware: ErrorRequestHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  
  if (err && err.name && (<Error>err).name === "ApplicationError") {
    res.statusCode = 400;
    res.send((<ApplicationError>err).message);
    return;
  }
  res.sendStatus(500).send("Internal Server Error!");
};
