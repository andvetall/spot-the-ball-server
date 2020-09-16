require('dotenv').config()
import "reflect-metadata";
import "di-container";
import app from "./app";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
const httpsPort = process.env.PORTHttp;
const httpPort = process.env.PORTHttps;

import { Environments } from "environment/environment";
import { connection, connect } from "mongoose";

(async () => {
  try {
    connect(Environments.connectionString, {
      useNewUrlParser: true,
      dbName: Environments.databaseName,
      useUnifiedTopology: true,
    }).catch((e) => {
        console.log('Database connectivity error ', e)
    })
    connection.on('error', () => console.log('Error connection to DB'));
    connection.once('open',() => console.log("Connection has been established successfully."));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return;
  }
  const httpsOptions = {
    key: fs.readFileSync("./src/config/key.pem"),
    cert: fs.readFileSync("./src/config/cert.pem")
  };
  https.createServer(httpsOptions, app).listen(httpsPort, () => {
    console.log("Express https server listening on port " + httpsPort);
  });
  http.createServer(app).listen(httpPort, () => {
    console.log("Express http server listening on port " + httpPort);
  });
})();
