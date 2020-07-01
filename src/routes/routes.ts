import { Request, Response, Application } from "express";
import { diContainer } from "di-container";
import { Controller, ErrorHandler
} from "common";
const path = require('path');
export class Routes {
  routes(app: Application): void {
    const controllers = diContainer.getAll<Controller>("Controller");
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "GET request successfulll!!!!"
      });
    });

    app.route('/download').get((req,res,next) => {
      const filepath = path.join(__dirname, '../game-result.csv');
      res.header("Access-Control-Allow-Origin", "*");
      res.download(filepath);
    })

    for (const controller of controllers) {
      const routes = controller.routes();
      for (const route of routes) {
        if (route.type === "GET") {
          app.route(route.route).get(ErrorHandler(route.handlers));
        }
        if (route.type === "POST") {
          app.route(route.route).post(ErrorHandler(route.handlers));
        }
        if (route.type === "DELETE") {
          app.route(route.route).delete(ErrorHandler(route.handlers));
        }
        if (route.type === "PUT") {
          app.route(route.route).put(ErrorHandler(route.handlers));
        }
      }
    }
  }
}
