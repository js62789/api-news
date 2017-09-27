const bookshelf = require('../bookshelf');
const Feed = require('./feed');
const Source = require('./source');
const rss = require('../../../lib/rss');
const read = require('node-readability');

module.exports = bookshelf.Model.extend({

  tableName: 'article',

  feeds() {
    return this.belongsToMany(Feed, 'feed_has_article');
  },

  source() {
    return this.belongsTo(Source);
  },

  findOrImport() {
    return this.fetch()
      .then(article => {
        return article || article.importMetadata();
      })
      .then(article => {
        return article.get('content') ? article : article.importContent();
      });
  },

  importMetadata() {
    const guid = this.get('guid');

    if (!guid) {
      throw new Error('Can\'t import article metadata without guid');
    }

    return rss.getArticle(guid).then(article => {
      return this.save(article, { patch: true });
    });
  },

  importContent() {
    const guid = this.get('guid');

    if (!guid) {
      throw new Error('Can\'t import article content without guid');
    }

    const readRequest = new Promise((resolve, reject) => {
      read(guid, (err, article) => {
        if (err) {
          return reject(err);
        }
        resolve(article);
      });
    });

    return readRequest.then(response => {
      return this.save({ content: response.content }, { patch: true });
    });
  }

});
