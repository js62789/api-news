const tableName = 'source';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex(tableName).del()
    .then(function () {
      // Inserts seed entries
      return knex(tableName).insert([
        {
          id: 1,
          key: 'cnn',
          name: 'CNN',
          logo: 'cnn.svg',
          icon: 'cnn-icon.svg',
          feed_id: 1
        },
        {
          id: 2,
          key: 'nytimes',
          name: 'New York Times',
          logo: 'nytimes.svg',
          icon: 'nytimes-icon.svg',
          feed_id: 2
        },
        {
          id: 3,
          key: 'wapost',
          name: 'Washington Post',
          logo: 'wapost.svg',
          icon: 'wapost-icon.svg',
          feed_id: 3
        },
        {
          id: 4,
          key: 'ap',
          name: 'Associated Press',
          logo: 'ap.svg',
          icon: 'ap-icon.svg',
          feed_id: 4
        },
        {
          id: 5,
          key: 'usatoday',
          name: 'USA Today',
          logo: 'usatoday.svg',
          icon: 'usatoday-icon.svg',
          feed_id: 5
        },
        {
          id: 6,
          key: 'npr',
          name: 'NPR',
          logo: 'npr.svg',
          icon: 'npr-icon.svg',
          feed_id: 6
        },
        {
          id: 7,
          key: 'reuters',
          name: 'Reuters',
          logo: 'reuters.svg',
          icon: 'reuters-icon.svg',
          feed_id: 7
        },
        {
          id: 8,
          key: 'bbc',
          name: 'BBC',
          logo: 'bbc.svg',
          icon: 'bbc-icon.svg',
          feed_id: 8
        }
      ]);
    });
};
