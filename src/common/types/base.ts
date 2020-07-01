import { AuthContextModel } from "models";
import * as express from "express";

export interface RequestBase extends Request {
  user: AuthContextModel;
}

export interface RouteHandler {
  handlers: express.RequestHandler[];
  route: string;
  type: RouteType;
}

export interface Controller {
  routes(): RouteHandler[];
}

export type RouteType = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestGet<Params> {
  params: Params;
  user: AuthContextModel;
}

export interface RequestPost<BodyType> {
  body: BodyType;
  user: AuthContextModel;
  headers: any;
  params: any;
}

export interface ResponseBase<Model> extends Response {
  send: (body?: Model) => Response;
}

export class ApplicationError implements Error {
  name: string;
  message: string;
  stack?: string;

  constructor(message: string, stack?: string) {
    this.message = message;
    this.name = "ApplicationError";
    this.stack = stack;
  }
}
