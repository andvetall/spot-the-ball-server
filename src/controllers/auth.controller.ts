import { AuthService } from "../services";
import { AuthResponseModel, AuthLoginModel } from "models";
import { injectable, inject } from "inversify";
import {
  JwtHelper,
  Controller,
  RequestPost,
  ResponseBase,
  RouteHandler,
  ApplicationError,
} from "common";

@injectable()
export class AuthController implements Controller {
  @inject(AuthService) private _authService: AuthService;
  @inject(JwtHelper) private _jwtHelper: JwtHelper;
  constructor() {
    this.login = this.login.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  async login(
    request: RequestPost<AuthLoginModel>,
    response: ResponseBase<AuthResponseModel>
  ) {
    const user = await this._authService.login(
      request.body.email,
      request.body.password
    );
    const authContext = this._jwtHelper.authenticate(user);
    return response.send(authContext);
  }

  async addUser(
    request: RequestPost<any>, 
    response: ResponseBase<any>
  ) {
    try {
      const user = await this._authService.findOneUserByEmail(
        request.body.email
      );
      if (!user) {
        let qqq = await this._authService.addNewUser(request.body);

        response.send(qqq);
      } else if(user){
        throw new Error("User already exists");
      }
    } catch (err) {
      throw new ApplicationError(err.message);
    }
  }

  routes(): RouteHandler[] {
    const handlers: RouteHandler[] = [];
    const prefix = "auth";
    handlers.push({
      route: `/${prefix}/login`,
      handlers: [<any>this.login],
      type: "POST",
    });
    handlers.push({
      route: `/${prefix}/addUser`,
      handlers: [<any>this.addUser],
      type: "POST",
    });
    return handlers;
  }
}
