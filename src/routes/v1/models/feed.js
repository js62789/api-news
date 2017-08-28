const bookshelf = require('../bookshelf');
const Feed = require('./feed');
const Source = require('./source');

module.exports = bookshelf.Model.extend({

  tableName: 'feed',

  articles() {
    return this.hasMany(Feed);
  },

  source() {
    return this.belongsTo(Source);
  }

});
