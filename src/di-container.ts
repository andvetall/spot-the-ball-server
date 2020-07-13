import { Container } from "inversify";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller"
import { JwtHelper, Controller, HashEncrypter } from "common";
import { GamesController } from "controllers/games.controller";
import { GamesService } from "services/games.service";
import { ResultController } from "controllers/result.controller";
import { ResultService } from "services/result.service";
import { UserController } from "controllers/user.controller";
import { UserService } from "services/user.service";

export const diContainer = new Container();

diContainer.bind<JwtHelper>(JwtHelper).toSelf();
diContainer.bind<HashEncrypter>(HashEncrypter).toSelf();

diContainer.bind<AuthService>(AuthService).toSelf();
diContainer.bind<GamesService>(GamesService).toSelf();
diContainer.bind<ResultService>(ResultService).toSelf();
diContainer.bind<UserService>(UserService).toSelf();

diContainer.bind<Controller>("Controller").to(AuthController);
diContainer.bind<Controller>("Controller").to(GamesController);
diContainer.bind<Controller>("Controller").to(ResultController);
diContainer.bind<Controller>("Controller").to(UserController);