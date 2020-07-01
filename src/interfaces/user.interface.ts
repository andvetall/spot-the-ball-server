import { Document } from "mongoose";

export interface User extends Document {
  _id: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
  gameType: string,
}