import { AuthUserModel } from "../models";
import { inject, injectable } from "inversify";
import { ApplicationError } from "common";
import { HashEncrypter } from "common/hash-encrypter";
import { model } from "mongoose";
import { UserSchema } from "schemas/user.schema";
export const UserModel = model("users", UserSchema);
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'puckhunt123@gmail.com',
    pass: 'PuckHunt123!!!'
  }
}));
@injectable()
export class AuthService {
  constructor(
    @inject(HashEncrypter) private _hashEncrypter: HashEncrypter,
  ) {}

  async login(email: string, password: string): Promise<AuthUserModel> {
    const hashedPassword = this._hashEncrypter.getHash(password);
    const user: any = await UserModel.findOne({
      email: email,
      password: hashedPassword,
    });
    if (!user) {
      throw new ApplicationError("Check your 'Sign-in' data");
    }
    return user;
  }
  
}