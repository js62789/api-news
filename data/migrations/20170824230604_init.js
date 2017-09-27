
exports.up = function(knex) {
  return knex.schema
    .createTableIfNotExists('source', function(table) {
      table.increments('id').primary();
      table.string('key');
      table.string('name');
      table.string('logo');
      table.string('icon');
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
      table.string('guid').unique().notNullable();
      table.string('description');
      table.string('title');
      table.string('image');
      table.string('thumbnail');
      table.string('url');
      table.string('link');
      table.string('publisher');
      table.string('summary');
      table.text('content');
      table.string('rss_author');
      table.string('rss_date');
      table.string('rss_description');
      table.string('rss_guid').unique().notNullable();
      table.string('rss_image');
      table.string('rss_thumbnail');
      table.string('rss_link');
      table.string('rss_permalink');
      table.timestamp('rss_pubdate');
      table.string('rss_publisher');
      table.string('rss_summary');
      table.string('rss_title');
      table.string('scrape_author');
      table.string('scrape_date');
      table.string('scrape_description');
      table.string('scrape_image');
      table.string('scrape_publisher');
      table.string('scrape_title');
      table.string('scrape_url');
    })
    .createTableIfNotExists('feed_has_article', function(table) {
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
    .dropTableIfExists('feed_has_article');
};
