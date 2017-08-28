const bookshelf = require('../bookshelf');
const Feed = require('./feed');
const Source = require('./source');

module.exports = bookshelf.Model.extend({

  tableName: 'article',

  feeds() {
    return this.belongsToMany(Feed);
  },

  source() {
    return this.belongsTo(Source);
  }

});
