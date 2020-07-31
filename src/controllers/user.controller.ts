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
    this.inviteUser = this.inviteUser.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.getAllRequests = this.getAllRequests.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
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

  async inviteUser(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const userExists = await this._userService.findOneUserByEmail(request.body.email)
    if(userExists) {
      throw new ApplicationError("User already exists");
    }
    const newUser = await this._userService.inviteUser(request.body);
    return response.send(newUser);
  }

  async sendRequest (
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const requestExists = await this._userService.findOneRequestByEmail(request.body.email)
    if(requestExists && requestExists.opened) {
      throw new ApplicationError("You’ve already sent the request for this email address.");
    }
    const userExists = await this._userService.findOneUserByEmail(request.body.email);
    if(userExists){
      throw new ApplicationError(`Request failed! User ${request.body.email} already exists`);
    }
    if(requestExists) {
      throw new ApplicationError("Something went wrong");
    }
    const newRequest = await this._userService.sendRequest(request.body);
    return response.send(newRequest);
  }

  async getAllRequests(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const res = await this._userService.getAllRequests();
    return response.send(res);
  }

  async deleteRequest(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const requestToDelete = await this._userService.findOneRequestByEmail(request.body.email);
    const res = await this._userService.deleteRequest(requestToDelete)
    return response.send(res);
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
    handlers.push({
      route: `/${prefix}/inviteUser`,
      handlers: [<any>this.inviteUser],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/sendRequest`,
      handlers: [<any>this.sendRequest],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/getAllRequests`,
      handlers: [<any>this.getAllRequests],
      type: "GET"
    });
    handlers.push({
      route: `/${prefix}/deleteRequest`,
      handlers: [<any>this.deleteRequest],
      type: "POST"
    });
    return handlers;
  }
  
}