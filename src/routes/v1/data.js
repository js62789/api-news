const read = require('node-readability');
const rss = require('../../lib/rss');
const Source = require('./models/source');
const Feed = require('./models/feed');
const Article = require('./models/article');

/* DATA ACCESS */

const returnJSON = model => model.toJSON();

const getSources = () => {
  return Source.fetchAll().then(returnJSON);
};

const getSourceById = (id) => {
  return Source.where({ id }).fetch().then(returnJSON);
};

const getSourceByKey = (key) => {
  return Source.where({ key }).fetch().then(returnJSON);
};

const getFeeds = () => {
  return Feed.fetchAll();
};

const getFeed = (id) => {
  return Feed.where({ id }).fetch().then(returnJSON);
};

const getArticleByGUID = (guid) => {
  return Article.where({ guid }).fetch()
    .then(article => {
      if (!article) {
        return rss.getArticle(guid).then(article => {
          return Article.forge(article).save({ guid });
        });
      }

      return article;
    })
    .then(article => {
      if (!article.get('content')) {
        const readFetch = new Promise((resolve, reject) => {
          read(guid, (err, article) => {
            if (err) {
              return reject(err);
            }
            resolve(article);
          });
        });
        return readFetch.then(readArticle => {
          return article.save({ content: readArticle.content }, { patch: true });
        });
      }

      return article;
    })
    .then(returnJSON);
};

const getArticlesFromFeed = (feed_id, limit = 10) => {
  return Feed.where({ id: feed_id }).fetch()
    .then(feed => {
      if (feed.hasExpired()) {
        return feed.runImport().then(articles => articles.slice(-limit));
      } else {
        return feed.articles()
          .orderBy('date', 'DESC')
          .query(qb => { qb.limit(limit); })
          .fetch()
          .then(returnJSON);
      }
    });
};

module.exports = {
  getSourceById,
  getSourceByKey,
  getSources,
  getFeed,
  getFeeds,
  getArticleByGUID,
  getArticlesFromFeed
};
