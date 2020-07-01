import { Document } from "mongoose";
import { User } from "./user.interface";
import { Game } from "./game.interface";

export interface Result extends Document {
  game: Game,
  user: User,
  position: {
    x: number,
    y: number
  },
  difference: number
}