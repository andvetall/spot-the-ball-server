import { AuthContextModel } from "models/auth-context.model";

export interface AuthResponseModel {
  token: string;
  expiresIn: number;
  user: AuthContextModel;
}
