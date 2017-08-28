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
  }

});
