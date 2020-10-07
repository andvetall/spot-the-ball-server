import { AuthUserModel } from "../models";
import { inject, injectable } from "inversify";
import { ApplicationError } from "common";
import { HashEncrypter } from "common/hash-encrypter";
import { model } from "mongoose";
import { UserSchema } from "schemas/user.schema";
import { Environments } from "environment/environment";

export const UserModel = model("users", UserSchema);

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
  service: `${Environments.emailService}`,
  host: `${Environments.emailHost}`,
  auth: {
    user: `${Environments.email}`,
    pass: `${Environments.password}`
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

  async findOneByEmail(email): Promise<any> {
    const user = await UserModel.findOne({email: email})
    if(!user) {
      throw new ApplicationError("Check your Email");
    }
    return user
  }

  async resetPassword(email): Promise<any> {
    let generateP = () => {
      var pass = "";
      var str: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + "abcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 1; i <= 12; i++) {
        var char = Math.floor(Math.random() * str.length + 1);
        pass += str.charAt(char);
      }
      return pass;
    }
    const newPassword = generateP()
    const newUser = await UserModel.findOneAndUpdate(
      {
        email: email
      },
      {
        password: this._hashEncrypter.getHash(newPassword)
      }
    )
    if(!newUser){
      throw new ApplicationError("Something went wrong!");
    }
    
    const mailOptions = {
      from: `${Environments.email}`,
      to: `${email}`,
      subject: "Puck Hunt support team",
      text: "Your registration credentials",
      html: `
      <html>
        <head>
          <title></title>
        </head>
        <body>
          <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" 
          style="
            color: #444444;
            font-size: 12px;
            line-height: 20px;
            padding: 16px 16px 16px 16px;
            text-align: Center;
            width: 60%;
            margin: 0 auto;
          " 
          data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
            <div class="Unsubscribe--addressLine">
            <img style="
              cursor: auto;
              width: 50%;
            " 
            src="https://puckhunt.s3-us-west-1.amazonaws.com/Web_Puckhunt_Logo.png"/>
              <p class="Unsubscribe--senderName"
                style="font-size:18px;line-height:20px"
              >
                Sent by: <b>Puck Hunt</b>
              </p>
              <p class="Unsubscribe--senderName"
                style="font-size:14px;line-height:20px"
              >
                Your password has been updated! <br><b>Your password is:</b> ${newPassword} <br><b>Your login is:</b> ${email}
              </p>
              <p class="Unsubscribe--senderName"
                style="font-size:14px;line-height:20px">
                Important! Please set an easy to remember password once logged in</p>
              <p style="margin-top: 35px;">
                <a style="
                background: #00aae8;
                border: none;
                padding: 8px;
                text-decoration: none;
                border-radius: 5px;
                color: white;
                margin-top: 25px;
                " href="${Environments.link}/#/login">Sign In</a>
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
    return newUser;
  }
  
}