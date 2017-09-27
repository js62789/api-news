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

  findOrImportArticles(limit) {
    if (this.hasExpired()) {
      return this.runImport().then(() => this.findRecentArticles(limit));
    } else {
      return this.findRecentArticles(limit);
    }
  },

  findRecentArticles(limit) {
    return this.articles()
      .orderBy('date', 'DESC')
      .query(qb => { qb.limit(limit); })
      .fetch();
  },

  runImport() {
    const feed = this;
    const newArticlesFetch = rss.getArticles(this.get('url'))
      .then(articles => articles.map(article => Object.assign(article, {source_id: this.get('source_id')})));

    return newArticlesFetch
      .then(newArticles => {
        // Save articles to the database
        const saves = newArticles.map(newArticle => {
          return new Article({ guid: newArticle.guid }).fetch()
            .then(article => {
              if (article) {
                return article.save(newArticle, { patch: true });
              }
              return new Article(newArticle).save();
            });
        });

        return Promise.all(saves)
          .then(articles => feed.articles().attach(articles))
          .then(() => this.markImportComplete());
      });
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
