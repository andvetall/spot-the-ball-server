import { injectable } from "inversify";
import ResultModel from "schemas/result.schema";
import { ApplicationError } from "common";

const ObjectsToCsv = require("objects-to-csv");
const fs = require("fs");
const path = "./src/game-result.csv";

@injectable()
export class ResultService {
  constructor() {}

  async createCsv(id): Promise<any> {
    try {
      await fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      let sampleData = [];
      const resultSCV = await ResultModel.find({ game: id })
        .populate({ path: "user" })
        .populate({ path: "game" })
        .exec(async function (err, res) {
          if (err) {
            return console.log(err);
          } else
            for (const elem of res) {
              if( elem.user && elem.game) {
                let resultObj = {
                  gameType: elem.game.gameType,
                  gameName: elem.game.title,
                  startDate: new Date(elem.game.dateFrom).toDateString(),
                  endDate: new Date(elem.game.dateTo).toDateString(),
                  realPositionX: elem.game.positionX,
                  realPositionY: elem.game.positionY,
                  userId: elem.user._id,
                  email: elem.user.email,
                  firstName: elem.user.firstName,
                  lastName: elem.user.lastName,
                  placedX: elem.position.x,
                  placedY: elem.position.y,
                  score: elem.difference,
                };
                sampleData.push(resultObj);
                sampleData.sort((a, b) => b.score - a.score)
              }

            }
          const csv = new ObjectsToCsv(sampleData);
          await csv.toDisk("./src/game-result.csv", {
            append: true,
          });
        });
      return true;
    } catch (err) {
      return false;
    }
  }

  async getAllResults(): Promise<any> {
    const results: any = await ResultModel.find();
    return results;
  }

  async getOneById(resultId): Promise<any> {
    try {
      const result: any = await ResultModel.find({ game: resultId });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async addResult(result): Promise<any> {
    try {
      const data: any = await ResultModel.create(result);
      return data;
    } catch (err) {
      throw new ApplicationError(err.message);
    }
  }
  
}
