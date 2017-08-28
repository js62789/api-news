const rss = require('../../lib/rss');
const Source = require('./models/source');
const Feed = require('./models/feed');
const Article = require('./models/article');

const returnJSON = model => model.toJSON();

const getSources = () => {
  return Source.fetchAll().then(returnJSON);
};

const getSource = (id) => {
  return Source.where({ id: id }).fetch()
    .then(source => {
      if (source) {
        return source.toJSON();
      }

      return Source.where({ key: id }).fetch().then(returnJSON);
    });
};

const getFeeds = () => {
  return Feed.fetchAll();
};

const getFeed = (id) => {
  return Feed.where({ id: id }).fetch().then(returnJSON);
};

const getArticleByGUID = (guid) => {
  return Article.where({ guid: guid }).fetch()
    .then(existingArticle => {
      if (!existingArticle) {
        const promise = rss.getArticle(guid);

        promise.then(article => {
          Article.forge(article).save();
        });

        return promise;
      }
    });
};

const getArticlesFromFeed = (feed_id, limit = 10) => {
  return Feed.where({ id: feed_id }).fetch().then(feed => {
    const msSinceLastJob = Date.now() - feed.get('last_job_timestamp');
    const expiry = 1000 * 60 * 60;
    if (msSinceLastJob > expiry) {
      const promise = rss.getArticles(feed.get('url'), { limit });

      promise.then(articles => {
        Promise.all(articles.map(article => {
          return Article.where({ guid: article.guid }).fetch()
            .then(existingArticle => {
              // TODO Update an article if exists
              if (!existingArticle) {
                return Article.forge(article).save({ feed_id: feed.get('id'), source_id: feed.get('source_id') });
              }
            });
        }));
      })
      .then(() => {
        feed.set('last_job_timestamp', Date.now()).save();
      });

      return promise;
    } else {
      return Article.where({ feed_id: feed.get('id') }).fetch().then(returnJSON);
    }
  });
};

module.exports = {
  getSource,
  getSources,
  getFeed,
  getFeeds,
  getArticleByGUID,
  getArticlesFromFeed
};
