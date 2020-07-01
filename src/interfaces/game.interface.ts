import { Document, Schema } from "mongoose";

export interface Game extends Document{
    _id: Schema.Types.ObjectId,
    title: string,
    image: string,
    gameType: string,
    dateFrom: Date,
    dateTo: Date,
    positionX: number,
    positionY: number
}