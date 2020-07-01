import { } from "models";
import { injectable, inject } from "inversify";
import {
  JwtHelper,
  Controller,
  RequestPost,
  ResponseBase,
  RequestGet,
  RouteHandler
} from "common";
import { GamesService } from "services/games.service";

@injectable()
export class GamesController implements Controller {
  constructor(
    private gameService: GamesService
  ) {
    this.getAll = this.getAll.bind(this)
    this.addOne = this.addOne.bind(this)
    this.updateGame = this.updateGame.bind(this)
    this.deleteGame = this.deleteGame.bind(this)
    this.findOneById = this.findOneById.bind(this)
  }

  async getAll(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ){
    const features = await this.gameService.getAllImages();
    return response.send(features)
  }

  async addOne(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const feature = await this.gameService.addOneImage(request.body)
    return response.send(feature);
  }

  async updateGame(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const updatedGame = await this.gameService.updateCurrentGame(request.body);
    return response.send(updatedGame);
  }

  async deleteGame(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const game = await this.gameService.deleteCurrentGame(request.body);
    return response.send(game);
  }

  async findOneById(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const game = await this.gameService.findOneById(request.params.id)
    return response.send(game);
  }

  routes(): RouteHandler[] {
    const handlers: RouteHandler[] = [];
    const prefix = "games";
    handlers.push({
      route: `/${prefix}/getAll`,
      handlers: [<any>this.getAll],
      type: "GET"
    });
    handlers.push({
      route: `/${prefix}/addOne`,
      handlers: [<any>this.addOne],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/updateGame`,
      handlers: [<any>this.updateGame],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/deleteGame`,
      handlers: [<any>this.deleteGame],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/game/:id`,
      handlers: [<any>this.findOneById],
      type: "GET"
    });
    return handlers;
  }
}
