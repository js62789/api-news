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
    const newArticlesFetch = rss.getArticles(this.get('url'));

    newArticlesFetch
      .then(feedArticles => {
        // Attach feed_id and source_id
        const enhancedArticles = feedArticles.map(newArticle => (
          Object.assign(newArticle, { source_id: feed.get('source_id') })
        ));

        // Save articles to the database
        const saves = enhancedArticles.map(newArticle => Article.forge(newArticle).save());

        return Promise.all(saves)
          .then(articles => feed.articles().attach(articles))
          .then(() => this.markImportComplete());
      });

    return newArticlesFetch;
  },

  markImportComplete() {
    return this.set('last_job_timestamp', Date.now()).save();
  },

  articles() {
    return this.belongsToMany(Article);
  },

  source() {
    return this.belongsTo(Source);
  }

});
