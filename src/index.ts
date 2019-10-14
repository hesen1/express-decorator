import express from "express";
import timeout from "connect-timeout";
import bodyParser from "body-parser";
import cors from "cors";

import { haltOnTimedout } from "sakura-node-3";

import { appLog, appError } from "./util/log";
import errorHandler from "./middleware/errorHandler";
import responseTime from "./middleware/responseTime";

import { APP_PORT, NODE_ENV } from "./config/env";

import v1 from "./route/v1";
import v2 from "./route/v2";

const app = express();

app.use(responseTime);
app.options("*", cors());
app.use(cors());
app.use(timeout("30s"));
app.use(bodyParser.json());
app.use(haltOnTimedout);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(haltOnTimedout);

app.use("/api", v1);
app.use("/api", v2);

app.use(errorHandler);

app.listen(APP_PORT, () => {
  appLog(`[${new Date().toLocaleString()}] App is running at http://localhost:%d in %s mode`,
  APP_PORT,
  NODE_ENV
	);
});

process.on("uncaughtException", (err: any) => {
  appError(`[${new Date().toLocaleString()}] Caught exception: ${err}`);
});
