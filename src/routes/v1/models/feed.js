const bookshelf = require('../bookshelf');
const Article = require('./article');
const Source = require('./source');
const rss = require('../../../lib/rss');

module.exports = bookshelf.Model.extend({

  tableName: 'feed',

  expiry: 1000 * 60 * 60,

  hasExpired() {
    const lastRun = this.get('last_job_timestamp') || 0;
    const msSinceLastJob = Date.now() - lastRun;
    const expiry = this.expiry;
    return msSinceLastJob > expiry;
  },

  runImport() {
    const feed = this;
    const newArticlesFetch = rss.getArticles(this.get('url'))
      .then(articles => articles.map(article => Object.assign(article, {source_id: this.get('source_id')})));

    newArticlesFetch
      .then(articles => {
        // Save articles to the database
        const saves = articles.map(article => (new Article(article)).save(null, { require: false }));

        return Promise.all(saves)
          .then(articles => feed.articles().attach(articles))
          .then(() => this.markImportComplete())
          .catch(e => console.error(e));
      });

    return newArticlesFetch;
  },

  markImportComplete() {
    return this.set('last_job_timestamp', Date.now()).save();
  },

  articles() {
    return this.belongsToMany(Article, 'feed_has_article');
  },

  source() {
    return this.belongsTo(Source);
  }

});
