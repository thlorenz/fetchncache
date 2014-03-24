'use strict';
/*jshint asi: true */

var test        = require('tap').test
  , http        = require('http')
  , fetchncache = require('../')
  , service      = require('./util/service')
  , url         = 'http://all.our.resources.com'
  , redis       = { port: 6379, host : process.env.REDIS_HOST || '33.33.33.100' }

test('\nall defaults, getting same resource twice ', function (t) {
  var res1= { id: 'res1', data: 'data1' };
  var nock = service(url, {
    '/res1': res1 
  })

  var fnc = fetchncache({ 
      redis: redis
    , service: { url: url }
  }).clearCache();

  t.once('end', function () { 
    fnc.stop();
    nock.cleanAll();
  })

  var body = '';
  fnc.fetch('/res1', function (err, res, fromCache) {
    if (err) { t.fail(err); return t.end(); }
    t.deepEqual(JSON.parse(res), res1, 'gets it');
    t.ok(!fromCache, 'not from cache at first');

    fnc.fetch('/res1', function (err, res, fromCache) {
      if (err) { t.fail(err); return t.end(); }

      t.deepEqual(JSON.parse(res), res1, 'gets it from cache first time');
      t.ok(fromCache, 'from cache the second time');

      t.end();
    })
  })
})
