const expect = require('chai').expect;
const stdMocks = require('std-mocks');

describe('should be an object with log level functions', () => {
  describe('has the required log levels', () => {
    const logger = require('./index');
    const levels = [
      'error',
      'warn',
      'info',
      'verbose',
      'debug',
      'silly'
    ];

    levels.forEach(level => {
      it(`has ${level}`, () => expect(logger[level]).to.be.a('function'))
    });
  })
});

describe('should handle', () => {
  let logger;
  beforeEach(function() {
    logger = require('./index');
  });

  it('just passing a string should be structured', () => {
    stdMocks.use();
    logger.info('hello world');
    stdMocks.restore();

    const {stdout, stderr} = stdMocks.flush();
    expect(stderr.length).to.equal(0);

    const log = JSON.parse(stdout[0]);
    expect(log.message.event).to.equal('hello world');
    expect(log.level).to.equal('info');
  });

  it('passing an error should structure it', () => {
    stdMocks.use();
    const error = new Error('test');
    logger.error({event: 'hello world', error});
    stdMocks.restore();

    const {stdout, stderr} = stdMocks.flush();
    expect(stderr.length).to.equal(0);

    const log = JSON.parse(stdout[0]);
    expect(log.message.event).to.equal('hello world');
    expect(log.level).to.equal('error');
    expect(log.message.error.message).to.equal('test');
    expect(typeof log.message.error.stack).to.equal('string')
  });
});
