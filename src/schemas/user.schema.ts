import { Schema, model } from "mongoose";
import { User } from "interfaces/user.interface";

export const UserSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    favoriteTeam: String,
    role: String,
    gameType: String,
    referredBy: Object,
    rate: Number
  },
  {
    collection: "users",
  }
);

export default model<User>("UserModel", UserSchema);
