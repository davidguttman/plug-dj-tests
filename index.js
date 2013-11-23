var fs = require('fs')
// var replay = require('replay')
var request = require('request')

var plugLogin = require('./plug-login')

var creds = {
    username: 'xxx'
  , password: 'xxx'
}

plugLogin(creds, function(err, jar) {
  console.log('jar', jar);
  var opts = {
      url: 'http://plug.dj/the-chillout-mixer/'
    , jar: jar
  }
  var req = request(opts, function(err, res, body) {
    console.log('res.headers', res.headers);
    console.log('res.statusCode', res.statusCode);
    // console.log('body', body);
  })
  console.log('req.headers', req.headers);
})