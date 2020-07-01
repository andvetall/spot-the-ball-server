import { Schema, model } from "mongoose";
import { Game } from "interfaces/game.interface";

export const GameSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    image: String,
    imageOriginal: String,
    gameType: String,
    dateFrom: Date,
    dateTo: Date,
    positionX: Number,
    positionY: Number
  });

export default model<Game>('Game', GameSchema);