
exports.up = function(knex) {
  return knex.schema
    .createTableIfNotExists('source', function(table) {
      table.increments('id').primary();
      table.string('key');
      table.string('name');
      table.string('logo');
      table.integer('feed_id').unsigned().references('id').inTable('feed');
    })
    .createTableIfNotExists('feed', function(table) {
      table.increments('id').primary();
      table.integer('source_id').unsigned().references('id').inTable('source');
      table.integer('source_key').unsigned().references('key').inTable('source');
      table.timestamp('last_job_timestamp').defaultTo(0);
      table.string('url');
    })
    .createTableIfNotExists('article', function(table) {
      table.increments('id').primary();
      table.integer('source_id').unsigned().references('id').inTable('source');
      table.string('author');
      table.string('date');
      table.timestamp('pubdate');
      table.string('permalink');
      table.string('guid').unique();
      table.string('description');
      table.string('title');
      table.string('image');
      table.string('url');
      table.string('link');
      table.string('publisher');
      table.string('summary');
      table.text('content');
    })
    .createTableIfNotExists('article_feed', function(table) {
      table.increments('id').primary();
      table.integer('feed_id').unsigned().references('id').inTable('feed');
      table.integer('article_id').unsigned().references('id').inTable('article');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('source')
    .dropTableIfExists('feed')
    .dropTableIfExists('article')
    .dropTableIfExists('feed_article');
};
