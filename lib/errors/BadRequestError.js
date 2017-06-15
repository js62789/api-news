function BadRequestError(message) {
  this.message = message || 'Bad Request';
  this.stack = new Error().stack;
  this.code = 400;
  this.errorType = this.name;
}

BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.name = 'BadRequestError';

module.exports = BadRequestError;
