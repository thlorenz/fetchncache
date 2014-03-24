'use strict';

var nock = require('nock')
  , xtend = require('xtend')

var go = module.exports = 

function (url, resources) {
  var server = nock(url)
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    });

  Object.keys(resources)
    .forEach(function (k) {
      var val = resources[k];
      server
        .get(k)
        .reply(200, val)
    })

  return nock;
}
