function NotFoundError(message) {
  this.message = message || 'Not Found';
  this.stack = new Error().stack;
  this.statusCode = 404;
  this.errorType = this.name;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.name = 'NotFoundError';

module.exports = NotFoundError;
