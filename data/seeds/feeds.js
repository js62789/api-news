const tableName = 'feed';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex(tableName).del()
    .then(function () {
      // Inserts seed entries
      return knex(tableName).insert([
        {
          id: 1,
          source_id: 1,
          source_key: 'cnn',
          url: 'http://rss.cnn.com/rss/cnn_topstories.rss'
        },
        {
          id: 2,
          source_id: 2,
          source_key: 'nytimes',
          url: 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'
        },
        {
          id: 3,
          source_id: 3,
          source_key: 'wapost',
          url: 'http://feeds.washingtonpost.com/rss/world'
        },
        {
          id: 4,
          source_id: 4,
          source_key: 'ap',
          url: 'http://hosted.ap.org/lineups/USHEADS-rss_2.0.xml?SITE=RANDOM&SECTION=HOME'
        },
        {
          id: 5,
          source_id: 5,
          source_key: 'usatoday',
          url: 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories'
        },
        {
          id: 6,
          source_id: 6,
          source_key: 'npr',
          url: 'http://www.npr.org/rss/rss.php?id=1001'
        },
        {
          id: 7,
          source_id: 7,
          source_key: 'reuters',
          url: 'http://feeds.reuters.com/reuters/topNews'
        },
        {
          id: 8,
          source_id: 8,
          source_key: 'bbc',
          url: 'http://newsrss.bbc.co.uk/rss/newsonline_world_edition/americas/rss.xml'
        }
      ]);
    });
};
