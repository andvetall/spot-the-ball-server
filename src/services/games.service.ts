import { injectable } from "inversify";
import GameModel from "schemas/game.schema";

const ObjectId = require("mongodb").ObjectID;

@injectable()
export class GamesService {
  constructor() {}

  async getAllImages(): Promise<any> {
    const assets: any = await GameModel.find();
    return assets;
  }

  async addOneImage(image): Promise<any> {
    try {
      let readyFeatureData = Object.assign({ _id: null }, image);
      const data: any = await GameModel.create(readyFeatureData);

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async updateCurrentGame(game): Promise<any> {
    try {
      let updateGame = await GameModel.findOneAndUpdate(
        { _id: game._id },
        game
      );
      return updateGame;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteCurrentGame(game): Promise<any> {
    try {
      await game.toString();
      let checkGame = await GameModel.findByIdAndDelete(game._id);

      return checkGame;
    } catch (err) {
      console.log(err);
    }
  }

  async findOneById(gameId): Promise<any> {
    try {
      const id = ObjectId(gameId);
      const game = await GameModel.findById(id);
      return game;
      
    } catch (err) {
      console.log(err);
    }      
  }
}
