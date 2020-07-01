import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/routes";
import * as cors from "cors";
import { ErrorMiddleware } from "middlewares/error.middleware.ts";

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.config();
    this.routePrv.routes(this.app);
    this.app.use((req, res, next) => {
      res.status(404).send("Could not find this page")
    })
    this.app.use(ErrorMiddleware);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static("public"));
  }
}

export default new App().app;
