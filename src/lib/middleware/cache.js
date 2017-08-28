const redis = require('redis');
const config = require('config');

const PORT = config.get('redis.port');
const HOST = config.get('redis.host');
const expiry = config.get('cache.expiry');

const client = redis.createClient(PORT, HOST);

// Other Events: connect, ready, reconnecting, error
client.on('error', function (err) {
  console.error(err.message);
});

module.exports = function(req, res, next) {
  if (!client.connected) {
    return next();
  }

  const url = req.url;

  client.get(url, function(err, result) {
    if (result) {
      return res.send(JSON.parse(result));
    }

    const send = res.send.bind(res);
    res.send = function(body) {
      client.setex(url, expiry, JSON.stringify(body));
      send(body);
    };
    return next();
  });
};
