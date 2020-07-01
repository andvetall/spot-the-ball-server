import { Response, NextFunction, Request, RequestHandler } from "express";

export const errorWrapper = (requestHandler: RequestHandler) => {
  const errorHandlerWrapper: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return errorHandlerWrapper;
};

export const ErrorHandler = (handlers: RequestHandler[]) => {
  var newHandlers = [];
  for (let handler of handlers) {
    newHandlers.push(errorWrapper(handler));
  }
  return newHandlers;
};
