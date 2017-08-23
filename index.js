const config = require('config');
const server = require('./src/server');
const PORT = config.get('port');

server.listen(PORT, () => {
  console.log('Running on http://localhost:' + PORT);
});
