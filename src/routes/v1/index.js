if (process.env.MOCK) {
  module.exports = require('./mockRouter');
} else {
  module.exports = require('./router');
}
