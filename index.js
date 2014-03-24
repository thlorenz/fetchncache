'use strict';

var redis = require('redis')
  , xtend = require('xtend')
  ;

module.exports = FetchAndCache;

function FetchAndCache(opts) {
  if (!(this instanceof FetchAndCache)) return new FetchAndCache(opts);

  var redisOpts = xtend({ port: 6379, host: '127.0.0.1' }, opts.redis)
    , serverOpts = xtend({ port: 3000, host: '127.0.0.1' }, opts.server)

  this._defaultExpire = opts.defaultExpire || 15 * 60;
  this._serverOpts     = serverOpts;
  this._client         = redis.createClient(redisOpts.port, redisOpts.host, redisOpts)
}

var proto = FetchAndCache.prototype;

proto.fetch = function (uri, opts, cb) {
  var self = this;
  if (!self._client) return cb(new Error('fetchncache was stopped and can no longer be used to fetch data'));

  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = xtend({ expire: self.defaultExpire, transform: function (x) { return x } }, opts);

  self._client.get(uri, function (err, res) {
    if (err) return cb(err);
    if (res) return cb(null, res);  

    self._get(uri, function (err, res) {
      if (err) return cb(err);
      self._cache(uri, res, opts, cb);
    })
  });
}

proto.stop = function (force) {
  if (force) this._client.end(); else this._client.unref();  
  this._client = null;
}

proto.monitor = function (monitorfn, cb) {
  if (!this._client) return cb(new Error('fetchncache was stopped and can no longer be used to monitor data'));

  this._client.monitor(function (err) {
    if (err) return cb(err);
    this._client.on('monitor', monitorfn);  
  })
}

proto._get = function (uri, cb) {
  // TODO: get from server
  cb(null, { "server": "result" });
}

proto._cache = function (uri, res, opts, cb) {
  var self = this;
  var val;
  try {
    val = opts.transform(res);
  } catch (e) {
    return cb(e);
  }

  self._client.hmset(uri, val, function (err) {
    if (err) return cb(err);

    self._client.expire(uri, opts.expire, function (err) {
      if (err) return cb(err);
      cb(null, val);  
    })
  });
}
// Test
if (!module.parent && typeof window === 'undefined') {
  
  var fnc = module.exports({ 
      redis: { port: 6379  , host : '33.33.33.100' }
    , server: { port: 3002 , host: '127.0.0.1' }
  });
  fnc.fetch('my/uri', function (err, val) {
    if (err) return console.error(err);
    console.log(val);  
    fnc.stop();
  })

}
