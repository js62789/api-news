const router = require('express').Router();
const config = require('config');
const BadRequestError = require('../../lib/errors/BadRequestError');
const NotFoundError = require('../../lib/errors/NotFoundError');
const cache = require('../../lib/middleware/cache');
const Source = require('./models/source');
const Article = require('./models/article');
const Feed = require('./models/feed');

if (config.has('redis')) {
  router.use(cache);
}

router.get('/', (req, res) => {
  res.send({
    status: 'OK'
  });
});

router.get('/sources', function (req, res, next) {
  return Source.fetchAll()
    .then(sources => {
      res.send({
        sources: sources.toJSON()
      });
    })
    .catch(next);
});

router.get('/sources/:source_id(\\d+)', function (req, res, next) {
  return new Source({ id: req.params.source_id }).fetch()
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      res.send({
        sources: [ source.toJSON() ]
      });
    })
    .catch(next);
});

router.get('/sources/:source_key', function (req, res, next) {
  return new Source({ key: req.params.source_key }).fetch()
    .then(source => {
      if (!source) {
        throw new NotFoundError('Feed Not Found');
      }
      res.send({
        sources: [ source.toJSON() ]
      });
    })
    .catch(next);
});

router.get('/feeds', function (req, res, next) {
  return Feed.fetchAll()
    .then(feeds => {
      res.send({
        feeds: feeds.toJSON()
      });
    })
    .catch(next);
});

router.get('/feeds/:feed_id', function (req, res, next) {
  return new Feed({ id: req.params.feed_id }).fetch()
    .then(feed => {
      if (!feed) {
        throw new NotFoundError('Source Not Found');
      }
      res.send({
        feeds: [ feed.toJSON() ]
      });
    })
    .catch(next);
});

router.get('/sources/:source_id(\\d+)/articles', function (req, res, next) {
  return new Source({ id: req.params.source_id }).fetch()
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      return source.findOrImportArticles(req.query.limit)
        .then((articles) => {
          res.send({
            source: source.toJSON(),
            articles: articles.toJSON()
          });
        });
    })
    .catch(next);
});

router.get('/sources/:source_key/articles', function (req, res, next) {
  return new Source({ key: req.params.source_key }).fetch()
    .then(source => {
      if (!source) {
        throw new NotFoundError('Source Not Found');
      }
      return source.findOrImportArticles(req.query.limit)
        .then((articles) => {
          res.send({
            source: source.toJSON(),
            articles: articles.toJSON()
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

  return new Feed({ url: feed }).fetch()
    .then(feed => {
      if (!feed) {
        return Feed.save({ url: feed });
      }
      return feed;
    })
    .then(feed => feed.findOrImportArticles())
    .then((articles) => {
      res.send({
        articles
      });
    })
    .catch(next);
});

router.get('/articles/:guid', function (req, res, next) {
  return new Article({ guid: req.params.guid }).findOrImport()
    .then((article) => {
      res.send({
        articles: [ article.toJSON() ]
      });
    })
    .catch(next);
});

module.exports = router;
