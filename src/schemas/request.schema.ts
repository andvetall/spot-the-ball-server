import { Schema, model } from "mongoose";
import { RequestInt } from "interfaces/request.interface";

export const RequestSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    email: String,
    firstName: String,
    lastName: String,
    opened: Boolean,
    favoriteTeam: String,
    referredBy: Object,
    rate: Number
  },
  {
    collection: "requests",
  }
);

export default model<RequestInt>("RequestModel", RequestSchema);