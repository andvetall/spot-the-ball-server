import { Response, NextFunction, Request } from "express";
import { diContainer } from "di-container";
import { JwtHelper, RequestBase } from "common";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const request: RequestBase = <any>req;
  var token = request.headers["x-access-token"] as string;
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });
  const jwtHelper = diContainer.get<JwtHelper>(JwtHelper);
  const authContext = await jwtHelper.verify(token);
  if (!authContext) {
    return res
      .status(401)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
  request.user = authContext;
  next();
};
