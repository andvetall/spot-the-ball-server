import { UserService } from "services/user.service";
import { inject, injectable } from "inversify";
import { Controller, RouteHandler, RequestPost, ResponseBase, ApplicationError } from "common";

@injectable()
export class UserController implements Controller {
  @inject(UserService) private _userService: UserService;
  constructor() {
    this.addUser = this.addUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }
  async addUser(
    request: RequestPost<any>, 
    response: ResponseBase<any>
  ) {
    try {
      const user = await this._userService.findOneUserByEmail(
        request.body.email
      );
      if (!user) {
        let newUser = await this._userService.addNewUser(request.body);
        response.send(newUser);
      } else if(user){
        throw new Error("User already exists");
      }
    } catch (err) {
      throw new ApplicationError(err.message);
    }
  }

  async updateUserInfo(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const userInfo = await this._userService.updateUserInfo(request.body);
    return response.send(userInfo);
  }

  async deleteUser(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const user = await this._userService.deleteUser(request.body);
    return response.send(user);
  }

  async getAllUsers(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ){
    const usersList = await this._userService.getAllUsers();
    return response.send(usersList)
  }

  routes(): RouteHandler[] {
    const handlers: RouteHandler[] = [];
    const prefix = "user";
    handlers.push({
      route: `/${prefix}/addUser`,
      handlers: [<any>this.addUser],
      type: "POST",
    });
    handlers.push({
      route: `/${prefix}/updateUserInfo`,
      handlers: [<any>this.updateUserInfo],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/deleteUser`,
      handlers: [<any>this.deleteUser],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/getAllUsers`,
      handlers: [<any>this.getAllUsers],
      type: "GET"
    });
    return handlers;
  }

}