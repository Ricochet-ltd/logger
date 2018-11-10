const {createLogger, transports, format} = require('winston');

process.on('unhandledRejection', error => logger.error({event: 'Unhandled promise rejection', error}));

const addFormatting = format(info => {
  if(typeof info.message === 'string') info.message = { event: info.message };

  if(info.message.error instanceof Error) {
    info.message.error = Object.getOwnPropertyNames(info.message.error).reduce((acc, el) => { acc[el] = info.message.error[el]; return acc; }, {});
  }

  return info;
});

module.exports = (() => createLogger({
  format: format.combine(
    format.timestamp(),
    addFormatting(),
    format.json(),
  ),
  transports: [
    new transports.Console(),
  ]
}))();
