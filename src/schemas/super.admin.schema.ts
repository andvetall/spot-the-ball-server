import { Schema } from "mongoose";

export const  SuperAdminSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId
  }, {
      collection: 'superAdmin'
    }
  );