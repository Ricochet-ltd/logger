const { createLogger, transports, format, config } = require("winston");
const StackUtils = require("stack-utils");
const stackUtils = new StackUtils({
  cwd: process.cwd(),
  internals: StackUtils.nodeInternals(),
});

const addFormatting = format((info) => {
  if (typeof info.message === "string") info.message = { event: info.message };

  /* we take JS errors, and normalise them to (winston won't handle them normally, so we have to do something anyway):
    {error: {name, message, stack}
   */
  if (info.message.error instanceof Error) {
    const { name, message, stack: fullStack } = info.message.error;
    const stack = stackUtils.clean(fullStack);
    info.message.error = {
      name,
      message,
      stack,
    };
  }

  // Move stuff into the message object
  if (info.module) {
    info.message.module = info.module;
    delete info.module;
  }

  // For express-winston
  if (info.meta) {
    info.message = {
      ...info.meta,
      ...info.message,
    };
    delete info.meta;
  }

  //Switch to kebab case
  if (info.message.userId || info.message.user?.id) {
    info.message["user-id"] = info.message.userId || info.message.user?.id;
    delete info.message.userId;
  }

  if (info.message.traceId) {
    info.message["trace-id"] = info.message.traceId;
    delete info.message.traceId;
  }

  info.message = {
    event: info.message.event,
    module: info.message.module,
    ...info.message,
  };

  // Limit the size of the business object. If we want to log the FULL business for some reason, name the field something different
  if (info.message.business) {
    info.message.business = {
      id: info.message.business.id,
      name: info.message.business.name,
    };
  }

  return info;
});

class Log {
  logger;

  constructor() {
    const options = {
      format: format.combine(
        format.timestamp(),
        addFormatting(),
        format.json()
      ),
      transports: [new transports.Console()],
    };

    this.logger = createLogger(options);

    this.logger.addModule = (module) => this.logger.child({ module });

    return this.logger;
  }
}

module.exports = Log;
