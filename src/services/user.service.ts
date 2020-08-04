import { User } from "./../interfaces/user.interface";
import { inject, injectable } from "inversify";
import { HashEncrypter } from "common/hash-encrypter";
import { model } from "mongoose";
import { UserSchema } from "schemas/user.schema";
import { JwtHelper } from "common";
import { RequestSchema } from "schemas/request.schema";
export const UserModel = model("users", UserSchema);
export const RequestModel = model("request", RequestSchema);
const ObjectsToCsv = require("objects-to-csv");
const fs = require("fs");
const path = "./src/users-list.csv";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "testspotball@gmail.com",
      pass: "alex123456789!",
    },
  })
);
@injectable()
export class UserService {
  constructor(
    @inject(HashEncrypter) private _hashEncrypter: HashEncrypter,
    @inject(JwtHelper) private _jwtHelper: JwtHelper
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
        from: "testspotball@gmail.com",
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
        `,
      };
      await transporter.sendMail(mailOptions, function (error, info) {
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

  async inviteUser(user): Promise<any> {
    try {
      const authContext = this._jwtHelper.authenticate(user);
      const mailOptions = {
        from: "testspotball@gmail.com",
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
                You are one of the first to be introduced to our game because you were referred by a friend.
                We are building a company and brand from scratch. At the beinning we are hoping to have your involvement while providing you some clean simple fun.
                We want you to play our Puck Hunt game for a few minutes once a week. Its a very basic trial version and honestly its not very user friendly yet. You need to use it on your PC not your mobile and you dont get to chose your password yet.
                Please play just for fun, once a week for the next few months and then take a very short survey at the end and we will reward you. You will get free play for the next month while others are paying with chances at prizes worth hundreds of dollars. The site will be better by then.
                If you are up for it please add your name and email to the form at this link http://stb.webcentriq.com/#/invite;token=${authContext.token}
                </p>
              </div>
            </div>
          </body>
        </html>
        `,
      };
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return;
        }
      });
      return user;
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

  async findOneRequestByEmail(email): Promise<any> {
    return RequestModel.findOne({
      email: email,
    });
  }

  async findOneRequestByID(id): Promise<any> {
    return RequestModel.findOne({
      _id: id,
    });
  }

  async getAllRequests(): Promise<any> {
    return await RequestModel.find();
  }

  async deleteRequest(id) {
    let res = await RequestModel.findOneAndDelete({_id: id});
    return res;
  }

  async sendRequest(newUser): Promise<any> {
    try {
      let newRequest = await RequestModel.create(
        Object.assign({ opened: true, _id: null }, newUser)
      );
      return newRequest;
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

  async createUsersCsv(): Promise<any> {
    try {
      await fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      let sampleData = [];
      const resultSCV = await UserModel.find();
      resultSCV.forEach((elem: any) => {
        let resultObj = {
          email: elem.email,
          firstName: elem.firstName,
          lastName: elem.lastName,
          gameType: elem.gameType,
        };
        sampleData.push(resultObj);
      });
      const csv = new ObjectsToCsv(sampleData);
      await csv.toDisk("./src/users-list.csv", {
        append: true,
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
