export = Log;

import * as winston from "winston";

interface Log extends winston.Logger {
  addModule(module: string): winston.Logger;
}
