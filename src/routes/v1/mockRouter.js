const router = require('express').Router();
const BadRequestError = require('../../lib/errors/BadRequestError');
const NotFoundError = require('../../lib/errors/NotFoundError');
const sources = require('./sources');

const createSVG = (width, height) => {
  const backgroundColor = '#eee';
  const fontColor = '#888';
  const fontSize = '16px';
  return `
    data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
      <text text-anchor="middle" x="${width/2}" y="${height/2}"
        style="fill:${fontColor};font-weight:bold;font-size:${fontSize}px;font-family:Arial,Helvetica,sans-serif;dominant-baseline:central">
        ${width}x${height}
      </text>
    </svg>
  `.replace(/\n/g, '').replace(/^\s+/g, '').replace(/>\s+</g, '><');
};

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.substring(1, word.length - 1);
};

const generateText = (wordCount) => {
  const source = 'Lorem ipsum dolor sit amet, mel munere singulis qualisque at. Sint urbanitas torquatos ea vel, quo autem possit cu. In est unum torquatos, sea ad possit consulatu dissentias';
  const sample = source.toLowerCase().replace('.', '').split(' ');
  const words = [];
  while (wordCount--) {
    words.push(sample[generateInteger(0, sample.length - 1)]);
  }
  words[0] = capitalize(words[0]);
  return words.join(' ') + '.';
};

const generateInteger = (min, max) => {
  return Math.floor(min + ((max - min) * Math.random()));
};

const generateURL = () => {
  return `http://example.org/${Math.random() * 100}`;
};

const getArticle = () => {
  const URL = generateURL();
  return {
    title: generateText(6),
    author: generateText(2),
    image: createSVG(500, 200),
    guid: URL,
    link: URL,
    summary: generateText(30),
    description: generateText(30),
    content: generateText(200),
  };
};

const getMultiple = (fnGetSingle, count) => {
  const multiple = [];
  while (count--) {
    multiple.push(fnGetSingle());
  }
  return multiple;
};

router.get('/', (req, res) => {
  res.send({
    status: 'OK'
  });
});

router.get('/sources', function (req, res) {
  const sourceArr = [];
  Object.keys(sources).forEach(key => {
    sourceArr.push(Object.assign({key: key}, sources[key]));
  });
  res.send({
    sources: sourceArr
  });
});

router.get('/sources/:source', function (req, res) {
  const source = req.params.source;
  res.send({
    sources: [Object.assign({ key: source }, sources[source])]
  });
});

router.get('/sources/:source/articles', function (req, res) {
  const source = sources[req.params.source];

  if (!source) {
    throw new NotFoundError('Source Not Found');
  }

  res.send({
    source: req.params.source,
    articles: getMultiple(getArticle, req.query.limit || 10)
  });
});

router.get('/articles', function (req, res) {
  const feed = req.query.feed;

  if (!feed) {
    throw new BadRequestError('Missing feed Parameter');
  }

  res.send({
    articles: getMultiple(getArticle, req.query.limit || 10)
  });
});

router.get('/articles/:guid', function (req, res) {
  res.send({
    articles: [ getArticle() ]
  });
});

module.exports = router;
