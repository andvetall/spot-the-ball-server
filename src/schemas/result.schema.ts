import { Schema, model } from "mongoose";
import { Result } from "interfaces/result.interface";

export const ResultSchema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true
    },
    position: {
      type: new Schema({
        x: {
          type: Number,
          required: true
        },
        y: {
          type: Number,
          required: true
        }
      }),
      required: true
    },
    difference: {
      type: Number,
      required: true
    }
  }
);

export default model<Result>("Result", ResultSchema);
