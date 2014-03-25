'use strict';

var redis      = require('redis')
  , xtend      = require('xtend')
  , hyperquest = require('hyperquest')
  ;

module.exports = FetchAndCache;

/**
 * Creates a fetchncache instance.
 * 
 * #### redis opts
 *
 * - **opts.redis.host**  *{number=}* host at which redis is listening, defaults to `127.0.0.1`
 * - **opts.redis.port**  *{string=}* port at which redis is listening, defaults to `6379`
 *
 * #### service opts
 *
 * - **opts.service.url** *{string=}* url at which to reach the service
 *
 * @name fetchncache
 * @function
 * @param {Object=} opts
 * @param {Object=} opts.redis        redis options passed straight to [redis](https://github.com/mranney/node_redis) (@see above)
 * @param {Object=} opts.service      options specifying how to reach the service that provides the data (@see above)
 * @param {number=} opts.expire       the default number of seconds after which to expire a resource from the redis cache (defaults to 15mins)
 * @return {Object} fetchncache instance
 */
function FetchAndCache(opts) {
  if (!(this instanceof FetchAndCache)) return new FetchAndCache(opts);
  opts = opts || {};

  var redisOpts = xtend({ port: 6379, host: '127.0.0.1' }, opts.redis)
    , serviceOpts = xtend({ url: 'http://127.0.0.1' }, opts.service)

  this._defaultExpire = opts.expire || 15 * 60 // 15min
  this._serviceOpts   = serviceOpts;
  this._markCached    = opts.markCached !== false;
  this._client        = redis.createClient(redisOpts.port, redisOpts.host, redisOpts)
}

var proto = FetchAndCache.prototype;

/**
 * Fetches the resource, probing the redis cache first and falling back to the service.
 * If a transform function is provided (@see opts), that is applied to the result before returning or caching it.
 * When fetched from the service it is added to the redis cached according to the provided options.
 * 
 * @name fetcncache::fetch
 * @function
 * @param {string}    uri path to the resource, i.e. `/reource1?q=1234`
 * @param {Object=}   opts            configure caching and transformation behavior for this particular resource
 * @param {number=}   opts.expire     overrides default expire for this particular resource
 * @param {function=} opts.transform  specify the transform function to be applied, default: `function (res} { return res }`
 * @param {function}  cb              called back with an error or the transformed resource
 */
proto.fetch = function (uri, opts, cb) {
  var self = this;
  if (!self._client) return cb(new Error('fetchncache was stopped and can no longer be used to fetch data'));

  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = xtend({ expire: self._defaultExpire, transform: function (x) { return x } }, opts);

  self._client.get(uri, function (err, res) {
    if (err) return cb(err);
    if (res) return cb(null, res, true);  

    self._get(uri, function (err, res) {
      if (err) return cb(err);
      self._cache(uri, res, opts, cb);
    })
  });
}

/**
 * Stops the redis client in order to allow exiting the application.
 * At this point this fetchncache instance becomes unusable and throws errors on any attempts to use it.
 * 
 * @name fetchncache::stop
 * @function
 * @param {boolean=} force will make it more aggressive about ending the underlying redis client (default: false)
 */
proto.stop = function (force) {
  if (!this._client) throw new Error('fetchncache was stopped previously and cannot be stopped again');
  if (force) this._client.end(); else this._client.unref();  
  this._client = null;
}

/**
 * Clears the entire redis cache, so use with care.
 * Mainly useful for testing or to ensure that all resources get refreshed.
 * 
 * @name fetchncache::clearCache
 * @function
 * @return {Object} fetchncache instance
 */
proto.clearCache = function () {
  if (!this._client) throw new Error('fetchncache was stopped previously and cannot be cleared');
  this._client.flushdb();
  return this;
}

proto._get = function (uri, cb) {
  var body = '';
  var url =  this._serviceOpts.url + uri;
  console.log('url', url);
  hyperquest
    .get(url)
    .on('error', cb)
    .on('data', function (d) { body += d.toString() })
    .on('end', function () { cb(null, body) })
}

proto._cache = function (uri, res, opts, cb) {
  var self = this;
  var val;
  try {
    val = opts.transform(res);
  } catch (e) {
    return cb(e);
  }

  // assuming that value is now a string we use set to add it
  self._client.set(uri, val, function (err) {
    if (err) return cb(err);

    self._client.expire(uri, opts.expire, function (err) {
      if (err) return cb(err);
      cb(null, val);  
    })
  });
}
