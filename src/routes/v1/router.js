const router = require('express').Router();
const config = require('config');
const BadRequestError = require('../../lib/errors/BadRequestError');
const NotFoundError = require('../../lib/errors/NotFoundError');
const cache = require('../../lib/middleware/cache');
const getSources = require('./data').getSources;
const getSourceById = require('./data').getSourceById;
const getSourceByKey = require('./data').getSourceByKey;
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

router.get('/sources', function (req, res, next) {
  return getSources()
    .then(sources => {
      res.send({
        sources
      });
    })
    .catch(next);
});

router.get('/sources/:source_id(\\d+)', function (req, res, next) {
  return getSourceById(req.params.source_id)
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      res.send({
        sources: [ source ]
      });
    })
    .catch(next);
});

router.get('/sources/:source_id', function (req, res, next) {
  return getSourceByKey(req.params.source_id)
    .then(source => {
      if (!source) {
        throw new NotFoundError('Feed Not Found');
      }
      res.send({
        sources: [ source ]
      });
    })
    .catch(next);
});

router.get('/feeds', function (req, res, next) {
  return getFeeds()
    .then(feeds => {
      res.send({
        feeds
      });
    })
    .catch(next);
});

router.get('/feeds/:feed_id', function (req, res, next) {
  return getFeed(req.params.feed_id)
    .then(feed => {
      if (!feed) {
        throw new NotFoundError('Source Not Found');
      }
      res.send({
        feeds: [ feed ]
      });
    })
    .catch(next);
});

router.get('/sources/:source(\\d+)/articles', function (req, res, next) {
  const sourceId = req.params.source;

  return getSourceById(sourceId)
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      return getArticlesFromFeed(source.feed_id, req.query.limit)
        .then((articles) => {
          res.send({
            source,
            articles: articles
          });
        });
    })
    .catch(next);
});

router.get('/sources/:source/articles', function (req, res, next) {
  const sourceKey = req.params.source;

  return getSourceByKey(sourceKey)
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      return getArticlesFromFeed(source.feed_id, req.query.limit)
        .then((articles) => {
          res.send({
            source,
            articles: articles
          });
        });
    })
    .catch(next);
});

router.get('/articles', function (req, res, next) {
  const feed = req.query.feed;

  if (!feed) {
    throw new BadRequestError('Missing feed Parameter');
  }

  return getArticlesFromFeed(feed)
    .then((articles) => {
      res.send({
        articles
      });
    })
    .catch(next);
});

router.get('/articles/:guid', function (req, res, next) {
  return getArticleByGUID(req.params.guid)
    .then((article) => {
      res.send({
        articles: [ article ]
      });
    })
    .catch(next);
});

module.exports = router;
