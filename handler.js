'use strict';

const cheerio = require('cheerio');
const fetch = require('node-fetch');

module.exports.scrape = (event, context, callback) => {
  if (
    !event ||
    !event.queryStringParameters ||
    !event.queryStringParameters.url
  ) {
    return sendResponse(400, 'Missing `url` param');
  }
  let originalUrl;
  console.log(`Fetching: ${event.queryStringParameters.url}`);

  fetch(event.queryStringParameters.url)
    .then(response => {
      originalUrl = response.url;
      return response.text();
    })
    .then(body => {
      let result = { longUrl: originalUrl };

      const $ = cheerio.load(body);
      const $title = $('title');
      if ($title) {
        result.title = $title[0].children[0].data;
      }

      const $meta = $('meta');
      for (let i = 0; i < $meta.length; i++) {
        const name = $meta[i].attribs.property || $meta[i].attribs.name;
        const value = $meta[i].attribs.content;

        if (name === 'og:title') {
          result.title = value;
        } else if (name === 'og:description') {
          result.description = value;
        } else if (name === 'og:image') {
          result.image = value;
        }
      }

      console.log('Result:', result);

      sendResponse(200, result);
    })
    .catch(err => {
      console.error(err);
      sendResponse(500);
    });

  //
  // Invoke callback on complete
  //
  // @param {integer} status
  // @param {message || object} body
  //
  function sendResponse(status, body) {
    let resBody = {};
    if (typeof body === 'object') {
      resBody = body;
    } else if (typeof body === 'string') {
      resBody = { message: body };
    }

    const response = {
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(resBody),
    };

    callback(null, response);
  }
};
