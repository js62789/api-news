const router = require('express').Router();
const config = require('config');
const BadRequestError = require('../../lib/errors/BadRequestError');
const NotFoundError = require('../../lib/errors/NotFoundError');
const cache = require('./cache');
const getSources = require('./data').getSources;
const getSource = require('./data').getSource;
const getArticle = require('./data').getArticle;
const getArticlesFromFeed = require('./data').getArticlesFromFeed;

if (config.has('redis')) {
  router.use(cache);
}

router.get('/', (req, res) => {
  res.send({
    status: 'OK'
  });
});

router.get('/sources', function (req, res) {
  return getSources()
    .then(sources => {
      res.send({
        sources
      });
    });
});

router.get('/sources/:source', function (req, res) {
  return getSource(req.params.source)
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      res.send({
        sources: [ source ]
      });
    });
});

router.get('/sources/:source/articles', function (req, res) {
  const sourceKey = req.params.source;

  return getSource(sourceKey)
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      return getArticlesFromFeed(source.feed, req.query.limit)
        .then((articles) => {
          res.send({
            source: sourceKey,
            articles: articles
          });
        });
    });
});

router.get('/articles', function (req, res) {
  const feed = req.query.feed;

  if (!feed) {
    throw new BadRequestError('Missing feed Parameter');
  }

  return getArticlesFromFeed(feed)
    .then((articles) => {
      res.send({
        articles
      });
    });
});

router.get('/articles/:guid', function (req, res) {
  return getArticle(req.params.guid)
    .then((article) => {
      res.send({
        articles: [ article ]
      });
    });
});

module.exports = router;
