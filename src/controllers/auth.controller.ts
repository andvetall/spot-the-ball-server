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

  routes(): RouteHandler[] {
    const handlers: RouteHandler[] = [];
    const prefix = "auth";
    handlers.push({
      route: `/${prefix}/login`,
      handlers: [<any>this.login],
      type: "POST",
    });
    return handlers;
  }
}
