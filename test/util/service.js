'use strict';

var nock = require('nock')
  , xtend = require('xtend')

var go = module.exports = 

function (url, resources, times) {
  var server = nock(url)
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    });

  Object.keys(resources)
    .forEach(function (k) {
      var val = resources[k];
      var get = server.get(k)
      if (times) get = get.times(times);
      get.reply(200, val)
    })

  return nock;
}
