'use strict';

var redis      = require('redis')
  , xtend      = require('xtend')
  , hyperquest = require('hyperquest')
  ;

module.exports = FetchAndCache;

function FetchAndCache(opts) {
  if (!(this instanceof FetchAndCache)) return new FetchAndCache(opts);

  var redisOpts = xtend({ port: 6379, host: '127.0.0.1' }, opts.redis)
    , serviceOpts = xtend({ url: 'http://127.0.0.1' }, opts.service)

  this._defaultExpire = opts.defaultExpire || 15 * 60
  this._serviceOpts   = serviceOpts;
  this._markCached    = opts.markCached !== false;
  this._client        = redis.createClient(redisOpts.port, redisOpts.host, redisOpts)
}

var proto = FetchAndCache.prototype;

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

proto.stop = function (force) {
  if (!this._client) throw new Error('fetchncache was stopped previously and cannot be stopped again');
  if (force || typeof this._client.unref !== 'function') this._client.end(); else this._client.unref();  
  this._client = null;
}

proto.monitor = function (monitorfn, cb) {
  if (!this._client) return cb(new Error('fetchncache was stopped and can no longer be used to monitor data'));

  this._client.monitor(function (err) {
    if (err) return cb(err);
    this._client.on('monitor', monitorfn);  
  })
}

proto.clearCache = function () {
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
