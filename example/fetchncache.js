'use strict';

var fetchncache = require('../')
  , nock = require('nock');

// This example requires a redis instance to run at REDIS_HOST:6379
var redis = {
    host: process.env.REDIS_HOST || '127.0.0.1'
  , port: 6379 
}
var service = {
  url: 'http://my.service.me'
}

// nocking service
nock(service.url)
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .get('/resource')
  .reply(200, { hello: 'world' }); 

var fnc = fetchncache({ 
    redis: redis
  , service: service
  , expire: 10 * 60 // expire cached values every 10 mins 
})

fnc.fetch('/resource', function (err, res, fromCache) {
  if (err) return console.error(err);
  console.log({ res: res, fromCache: fromCache });
  
  fnc.fetch('/resource', function (err, res, fromCache) {
    if (err) return console.error(err);
    console.log({ res: res, fromCache: fromCache });

    fnc.stop();
  })
})
