import { Document } from "mongoose";

export interface RequestInt extends Document {
  _id: string,
  email: string,
  firstName: string,
  lastName: string,
  opened: boolean
}