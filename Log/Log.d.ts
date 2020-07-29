export = Log;

import * as winston from "winston";

declare class Log {
    constructor();

    error: winston.LeveledLogMethod;
    warn: winston.LeveledLogMethod;
    info: winston.LeveledLogMethod;
    debug: winston.LeveledLogMethod;
    trace: winston.LeveledLogMethod;

    addModule(module: string): winston.Logger
}
