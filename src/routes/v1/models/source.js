const bookshelf = require('../bookshelf');
const Feed = require('./feed');
const Article = require('./article');

module.exports = bookshelf.Model.extend({

  tableName: 'source',

  feeds() {
    return this.hasMany(Feed);
  },

  articles() {
    return this.hasMany(Article);
  },

  findOrImportArticles(limit) {
    return new Feed({ id: this.get('feed_id') }).fetch()
      .then(feed => {
        return feed.findOrImportArticles(limit);
      });
  }

});
