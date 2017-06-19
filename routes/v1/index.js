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
  const source = sources[req.params.source];
  if (!source) {
    throw new NotFoundError('Source Not Found');
  }
  rss.getArticles(source.feed, (err, articles) => {
    res.send({
      source: req.params.source,
      articles: rss.simplifyArticles(articles)
    });
  });
});

router.get('/articles', function (req, res) {
  const feed = req.query.feed;

  if (!feed) {
    throw new BadRequestError('Missing feed Parameter');
  }

  rss.getArticles(feed, (err, articles) => {
    res.send({
      articles: rss.simplifyArticles(articles)
    });
  });
});

module.exports = router;
