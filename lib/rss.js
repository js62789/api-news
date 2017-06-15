const FeedParser = require('feedparser');
const request = require('request');

exports.getArticles = (feed, callback) => {
  const req = request(feed);
  const feedparser = new FeedParser();
  const articles = [];
  let returnedError;

  req.on('error', function (error) {
    if (!returnedError) {
      returnedError = error;
      callback(returnedError);
    }
  });

  req.on('response', function (res) {
    if (res.statusCode !== 200) {
      req.emit('error', new Error('Bad status code'));
    } else {
      req.pipe(feedparser);
    }
  });

  feedparser.on('error', function (error) {
    if (!error) {
      returnedError = error;
      callback(returnedError);
    }
  });

  feedparser.on('readable', () => {
    const meta = feedparser.meta;
    let article;

    while (article = feedparser.read()) {
      articles.push(article);
    }
  });

  feedparser.on('end', () => {
    callback(null, articles);
  });
};
