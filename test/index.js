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

  fnc.fetch('/res1', function (err, res, fromCache) {
    if (err) { t.fail(err); return t.end(); }
    t.deepEqual(JSON.parse(res), res1, 'gets it');
    t.ok(!fromCache, 'not from cache at first');

    fnc.fetch('/res1', function (err, res, fromCache) {
      if (err) { t.fail(err); return t.end(); }

      t.deepEqual(JSON.parse(res), res1, 'gets it');
      t.ok(fromCache, 'from cache the second time');

      t.end();
    })
  })
})

test('\ndefaultExpire 1s, getting same resource three times initially, before and after expire ', function (t) {
  var res1= { id: 'res1', data: 'data1' };
  var nock = service(url, {
    '/res1': res1 
  }, 2)

  var fnc = fetchncache({ 
      redis: redis
    , service: { url: url }
    , expire: 1
  })
  .clearCache();

  t.once('end', function () { 
    fnc.stop();
    nock.cleanAll();
  })

  fnc.fetch('/res1', function (err, res, fromCache) {
    if (err) { t.fail(err); return t.end(); }
    t.deepEqual(JSON.parse(res), res1, 'gets it');
    t.ok(!fromCache, 'not from cache at first');

    fnc.fetch('/res1', function (err, res, fromCache) {
      if (err) { t.fail(err); return t.end(); }

      t.deepEqual(JSON.parse(res), res1, 'gets it from cache');
      t.ok(fromCache, 'from cache the second time');

      // wait til default expire kicks in
      setTimeout(fetchAgain, 1500);

      function fetchAgain() {
        fnc.fetch('/res1', function (err, res, fromCache) {
          if (err) { t.fail(err); return t.end(); }

          t.deepEqual(JSON.parse(res), res1, 'gets it from cache first time');
          t.ok(!fromCache, 'not from cache third time');

          t.end();
        })
      }
    })
  })
})

test('\nall defaults getting same resource three times (passing expire) initially, before and after expire ', function (t) {
  var res1= { id: 'res1', data: 'data1' };
  var nock = service(url, {
    '/res1': res1 
  }, 2)

  var fnc = fetchncache({ 
      redis: redis
    , service: { url: url }
  }).clearCache();

  t.once('end', function () { 
    fnc.stop();
    nock.cleanAll();
  })

  fnc.fetch('/res1', { expire: 1 }, function (err, res, fromCache) {
    if (err) { t.fail(err); return t.end(); }
    t.deepEqual(JSON.parse(res), res1, 'gets it');
    t.ok(!fromCache, 'not from cache at first');

    fnc.fetch('/res1', function (err, res, fromCache) {
      if (err) { t.fail(err); return t.end(); }

      t.deepEqual(JSON.parse(res), res1, 'gets it from cache');
      t.ok(fromCache, 'from cache the second time');

      // wait til default expire kicks in
      setTimeout(fetchAgain, 1500);

      function fetchAgain() {
        fnc.fetch('/res1', function (err, res, fromCache) {
          if (err) { t.fail(err); return t.end(); }

          t.deepEqual(JSON.parse(res), res1, 'gets it from cache first time');
          t.ok(!fromCache, 'not from cache third time');

          t.end();
        })
      }
    })
  })
})

test('\nall defaults, getting two different resources twice ', function (t) {
  var res1= { id: 'res1', data: 'data1' };
  var res2= { id: 'res2', data: 'data2' };
  var nock = service(url, {
      '/res1': res1 
    , '/res2': res2 
  })

  var fnc = fetchncache({ 
      redis: redis
    , service: { url: url }
  }).clearCache();

  t.once('end', function () { 
    fnc.stop();
    nock.cleanAll();
  })

  t.plan(8)

  fnc.fetch('/res1', function (err, res, fromCache) {
    if (err) { t.fail(err); return t.end(); }
    t.deepEqual(JSON.parse(res), res1, 'gets res1');
    t.ok(!fromCache, 'not from cache at first');

    fnc.fetch('/res1', function (err, res, fromCache) {
      if (err) { t.fail(err); return t.end(); }

      t.deepEqual(JSON.parse(res), res1, 'gets res1');
      t.ok(fromCache, 'from cache the second time');
    })
  })

  fnc.fetch('/res2', function (err, res, fromCache) {
    if (err) { t.fail(err); return t.end(); }
    t.deepEqual(JSON.parse(res), res2, 'gets res2');
    t.ok(!fromCache, 'not from cache at first');

    fnc.fetch('/res2', function (err, res, fromCache) {
      if (err) { t.fail(err); return t.end(); }

      t.deepEqual(JSON.parse(res), res2, 'gets res2');
      t.ok(fromCache, 'from cache the second time');
    })
  })
})
