const router = require('express').Router();
const config = require('config');
const BadRequestError = require('../../lib/errors/BadRequestError');
const NotFoundError = require('../../lib/errors/NotFoundError');
const cache = require('../../lib/middleware/cache');
const getSources = require('./data').getSources;
const getSource = require('./data').getSource;
const getFeeds = require('./data').getFeeds;
const getFeed = require('./data').getFeed;
const getArticleByGUID = require('./data').getArticleByGUID;
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

router.get('/sources/:source_id', function (req, res) {
  return getSource(req.params.source_id)
    .then(source => {
      if (!source) {
        throw new NotFoundError('Feed Not Found');
      }
      res.send({
        sources: [ source ]
      });
    });
});

router.get('/feeds', function (req, res) {
  return getFeeds()
    .then(feeds => {
      res.send({
        feeds
      });
    });
});

router.get('/feeds/:feed_id', function (req, res) {
  return getFeed(req.params.feed_id)
    .then(feed => {
      if (!feed) {
        throw new NotFoundError('Source Not Found');
      }
      res.send({
        feeds: [ feed ]
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
      return getArticlesFromFeed(source.feed_id, req.query.limit)
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
  return getArticleByGUID(req.params.guid)
    .then((article) => {
      res.send({
        articles: [ article ]
      });
    });
});

module.exports = router;
