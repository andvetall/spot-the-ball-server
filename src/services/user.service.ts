import { User } from './../interfaces/user.interface';
import { inject, injectable } from "inversify";
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
    user: 'testspotball@gmail.com',
    pass: 'alex123456789!'
  }
}));
@injectable()
export class UserService {
  constructor(
    @inject(HashEncrypter) private _hashEncrypter: HashEncrypter,
  ) {}

  async findOneUserByEmail(email): Promise<any> {
    return UserModel.findOne({
      email: email,
    });
  }
  
  async addNewUser(user): Promise<any> {
    try {
      const unhashedPassword = user.password;
      const hashedPassword = this._hashEncrypter.getHash(user.password);
      user.password = hashedPassword;
      let userData = user;
      const mailOptions = {
        from: 'testspotball@gmail.com',
        to: `${user.email}`,
        subject: "Spot That Ball support team",
        text: "Your registration credentials",
        html: `
        <html>
          <head>
            <title></title>
          </head>
          <body>
            <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="background: #33cc8e1a; color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
              <div class="Unsubscribe--addressLine">
                <p class="Unsubscribe--senderName"
                  style="font-size:18px;line-height:20px"
                >
                  Sent by: Spot that ball
                </p>
                <p class="Unsubscribe--senderName"
                  style="font-size:14px;line-height:20px"
                >
                  You are successfully registered to game your password is - ${unhashedPassword}, your login is ${user.email}.
                  Use it here http://stb.webcentriq.com/#/login
                </p>
              </div>
            </div>
          </body>
        </html>
        `
      };
      await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return;
        }
      });
      const data: any = await UserModel.create(userData);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateUserInfo(user: User): Promise<any> {
    try {
      let updatedUser = await UserModel.findOneAndUpdate(
        { _id: user._id },
        user
      );
      return updatedUser;
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteUser(user: User): Promise<any> {
    try {
      await user.toString();
      let deleteUser = await UserModel.findByIdAndDelete(user._id);

      return deleteUser;
    } catch (err) {
      console.log(err.message);
    }
  }

  async getAllUsers(): Promise<any> {
    const usersList = await UserModel.find();
    return usersList;
  }
}