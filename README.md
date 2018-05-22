# meta-scrape

A really basic [Serverless](https://www.serverless.com) function for scraping meta data from a website.

This is primarily used by Shine's [spotlight](https://github.com/shinetext/spotlight) and [glow]((https://github.com/shinetext/glow) projects to show link previews at [daily.shinetext.com](http://daily.shinetext.com) and the Shine [mobile app](https://www.shinetext.com/app).

## Setup

Coming soon.

## Dev

Coming soon.

## Deploy

Deploys can be done via the Serverless CLI. Example:

```
$ serverless deploy -s prod -r us-east-1 -v
```

As an extra boost to performance, we enable [API Gateway caching](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html). After each deploy, it's worth verifying that caching is still enabled for the resource and that `url` is set as a cache key.

Enable caching:

1.  From the API Gateway UI, navigate to the meta-scrape API > Stage > select the deployed stage.
2.  Under Settings, check "Enable API cache" and save changes

Then to set the cache key:

1.  meta-scrape API > Resources > select /scrape GET > Method Request
2.  Under "URL Query String Parameters," choose to "Add query string" if `url` is not already set
3.  Add `url` and enable Caching
4.  Deploy the API change: Resources > Actions > Deploy API and choose the appropriate stage to deploy to
