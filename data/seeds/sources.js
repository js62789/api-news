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
          logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Cnn.svg',
          feed_id: 1
        },
        {
          id: 2,
          key: 'nytimes',
          name: 'New York Times',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png',
          feed_id: 2
        },
        {
          id: 3,
          key: 'wapost',
          name: 'Washington Post',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg',
          feed_id: 3
        },
        {
          id: 4,
          key: 'ap',
          name: 'Associated Press',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Associated_Press.svg',
          feed_id: 4
        },
        {
          id: 5,
          key: 'usatoday',
          name: 'USA Today',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/USA_Today_2012logo.svg',
          feed_id: 5
        },
        {
          id: 6,
          key: 'npr',
          name: 'NPR',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/National_Public_Radio_logo.svg',
          feed_id: 6
        },
        {
          id: 7,
          key: 'reuters',
          name: 'Reuters',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Reuters_2008_logo.svg',
          feed_id: 7
        },
        {
          id: 8,
          key: 'bbc',
          name: 'BBC',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/BBC.svg',
          feed_id: 8
        }
      ]);
    });
};
