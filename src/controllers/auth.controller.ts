import { AuthService } from "../services";
import { AuthResponseModel, AuthLoginModel } from "models";
import { injectable, inject } from "inversify";
import {
  JwtHelper,
  Controller,
  RequestPost,
  ResponseBase,
  RouteHandler,
} from "common";

@injectable()
export class AuthController implements Controller {
  @inject(AuthService) private _authService: AuthService;
  @inject(JwtHelper) private _jwtHelper: JwtHelper;
  constructor() {
    this.login = this.login.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
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

  async checkEmail(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const user = await this._authService.findOneByEmail(request.params.email);
    return response.send(user);
  }

  async resetPassword(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const updatedUser = await this._authService.resetPassword(request.params.email)
    return response.send(updatedUser);
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
      route: `/${prefix}/checkEmail/:email`,
      handlers: [<any>this.checkEmail],
      type: "GET",
    });
    handlers.push({
      route: `/${prefix}/resetPassword/:email`,
      handlers: [<any>this.resetPassword],
      type: "GET",
    });
    
    return handlers;
  }
}
