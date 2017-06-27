const router = require('express').Router();
const rss = require('../../lib/rss');
const BadRequestError = require('../../lib/errors/BadRequestError');
const NotFoundError = require('../../lib/errors/NotFoundError');
const sources = require('./sources');

router.get('/', (req, res) => {
  res.send({
    status: 'OK'
  });
});

router.get('/sources', function (req, res) {
  const sourceArr = [];
  Object.keys(sources).forEach(key => {
    sourceArr.push(Object.assign({key: key}, sources[key]));
  });
  res.send({
    sources: sourceArr
  });
});

router.get('/sources/:source', function (req, res) {
  const source = req.params.source;
  res.send({
    sources: [Object.assign({ key: source }, sources[source])]
  });
});

router.get('/sources/:source/articles', function (req, res) {
  const limit = req.query.limit;
  const after = req.query.after;
  const source = sources[req.params.source];

  if (!source) {
    throw new NotFoundError('Source Not Found');
  }

  rss.getArticles(source.feed, { limit, after })
    .then((articles) => {
      res.send({
        source: req.params.source,
        articles: articles
      });
    });
});

router.get('/articles', function (req, res) {
  const feed = req.query.feed;
  const limit = req.query.limit;
  const after = req.query.after;

  if (!feed) {
    throw new BadRequestError('Missing feed Parameter');
  }

  return rss.getArticles(feed, { limit, after })
    .then((articles) => {
      res.send({
        articles: articles
      });
    });
});

router.get('/articles/:article_id', function (req, res) {
  const guid = req.params.article_id;

  return rss.readAndFetchArticle(guid)
    .then((article) => {
      res.send({
        articles: [article]
      });
    });
});

module.exports = router;
