'use strict';
/*jshint asi: true */

var test        = require('tap').test
  , fetchncache = require('../')
  , service      = require('./util/service')
  , url         = 'http://all.our.resources.com'
  , redis       = { port: 6379, host : process.env.REDIS_HOST || '33.33.33.100' }

test('\nall defaults, getting same resource twice, providing transform', function (t) {
  var count = 0;
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

  function transform (json) {
    var obj = JSON.parse(json);
    obj.transformed = true;
    count++;
    return JSON.stringify(obj);
  }

  fnc.fetch('/res1', { transform: transform }, function (err, res, fromCache) {
    if (err) { t.fail(err); return t.end(); }
    var val = JSON.parse(res);
    t.ok(val.transformed, 'transforms it');
    delete val.transformed;
    t.deepEqual(val, res1, 'gets it');
    t.ok(!fromCache, 'not from cache at first');
    t.equal(count, 1, 'called transform once');

    fnc.fetch('/res1', function (err, res, fromCache) {
      if (err) { t.fail(err); return t.end(); }

      var val = JSON.parse(res);
      t.ok(val.transformed, 'returns the transformed response');
      delete val.transformed;
      t.deepEqual(val, res1, 'gets it');
      t.ok(fromCache, 'from cache the second time');
      t.equal(count, 1, 'doesnt call transform again');
      t.end();
    })
  })
})
