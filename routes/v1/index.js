const router = require('express').Router();
const rss = require('../../lib/rss');
const BadRequestError = require('../../lib/errors/BadRequestError');

router.get('/', (req, res) => {
  res.send({
    status: 'OK'
  });
});

router.get('/sources/nytimes/articles', function (req, res) {
  rss.getArticles('http://www.nytimes.com/services/xml/rss/nyt/World.xml', (err, articles) => {
    res.send({
      articles: articles
    });
  });
});

router.get('/articles', function (req, res) {
  const feed = req.query.feed;

  if (!feed) {
    throw new BadRequestError('Missing feed');
  }

  rss.getArticles(feed, (err, articles) => {
    res.send({
      articles: articles
    });
  });
});

module.exports = router;
