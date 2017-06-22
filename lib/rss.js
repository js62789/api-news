const FeedParser = require('feedparser');
const request = require('request');
const Metascraper = require('metascraper');
const read = require('node-readability');

const fetchArticles = (feed) => {
  return new Promise((resolve, reject) => {
    const req = request({
      url: feed,
      headers: {
        'Accept': 'application/rss+xml, application/rdf+xml;q=0.8, application/atom+xml;q=0.6, application/xml;q=0.4, text/xml;q=0.4'
      }
    });
    const feedparser = new FeedParser();
    const articles = [];
    let returnedError;

    req.on('error', function (error) {
      if (!returnedError) {
        returnedError = error;
        reject(returnedError);
      }
    });

    req.on('response', function (res) {
      if (res.statusCode !== 200) {
        req.emit('error', new Error('Bad status code'));
      } else {
        req.pipe(feedparser);
      }
    });

    feedparser.on('error', function (error) {
      if (!error) {
        returnedError = error;
        reject(returnedError);
      }
    });

    feedparser.on('readable', () => {
      const meta = feedparser.meta;
      let article;

      while (article = feedparser.read()) {
        articles.push(article);
      }
    });

    feedparser.on('end', () => {
      resolve(articles);
    });
  });
};

const simplifyArticles = articles => {
  return articles.map(simplifyArticle);
};

const simplifyArticle = article => {
  const desiredProperties = [
    'author',
    'date',
    'description',
    'guid',
    'link',
    'permalink',
    'pubdate',
    'summary',
    'title'
  ];
  const simpleArticle = {};

  desiredProperties.forEach(prop => {
    const value = article[prop];
    if (value) {
      simpleArticle[prop] = article[prop];
    }
  });

  simpleArticle.image = article.image.url;

  return simpleArticle;
};

const attachMetadata = article => {
  return Metascraper
    .scrapeUrl(article.link)
    .then((metadata) => Object.assign(article, metadata))
    .catch(e => { throw e; });
};

const getArticles = (feed, limit) => {
  return fetchArticles(feed)
    .then(articles => {
      if (limit && limit < articles.length) {
        return articles.splice(0, limit);
      } else {
        return articles;
      }
    })
    .then(articles => Promise.all(articles.map(simplifyArticle).map(attachMetadata)));
};

const readArticle = url => (
  new Promise((resolve, reject) => {
    read(url, (err, article/*, meta*/) => {
      if (err) {
        reject(err);
      }

      resolve(article);
    });
  })
);

module.exports = {
  attachMetadata,
  simplifyArticle,
  simplifyArticles,
  fetchArticles,
  getArticles,
  readArticle
};
