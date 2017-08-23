const rss = require('../../lib/rss');
const sources = require('./sources');

exports.getSources = () => {
  return new Promise((resolve) => {
    const sourceArr = [];
    Object.keys(sources).forEach(key => {
      sourceArr.push(Object.assign({key: key}, sources[key]));
    });
    resolve(sourceArr);
  });
};

exports.getSource = (source) => {
  return new Promise((resolve) => {
    resolve(Object.assign({ key: source }, sources[source]));
  });
};

exports.getArticle = (guid) => {
  return rss.getArticle(guid);
};

exports.getArticlesFromFeed = (feed, limit = 10) => {
  return rss.getArticles(feed, { limit });
};
