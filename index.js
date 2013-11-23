var fs = require('fs')
var replay = require('replay')
var request = require('request')
var cheerio = require('cheerio')

// authenticity_token=9fc99adc8a8df366880eeb4d6d0a8a04a6d7e6ae&
// oauth_token=kvokXWPQAoe7bY4cBitAmQ1zgOqdpc6kaiuea1fRILE&
// session%5Busername_or_email%5D={{TWITTER ID}}&
// session%5Bpassword%5D={{TWITTER PASSWORD}}

getTwitterLogin(function(err, location) {
  console.log('location', location);
  getTwitterTokens(location, function(err, tokens) {
    console.log('tokens', tokens);
    var creds = {
        authenticity_token: tokens.authenticity_token
      , oauth_token: tokens.oauth_token
      , 'session[username_or_email]': 'xxx'
      , 'session[password]': 'xxx'
    }

    twitterLogin(creds, function() {})

  })
  
})

function twitterLogin (creds) {
  console.log('creds', creds);
  var opts = {
      url: 'https://api.twitter.com/oauth/authenticate'
    , form: creds
  }
  request.post(opts, function(err, res, body) {
    console.log('err', err);
    console.log('body', body);
    console.log('res.headers', res.headers);

  })
}

function getTwitterTokens (url, cb) {
  request.get(url, function(err, res, body) {
    var $ = cheerio.load(body)
    
    var authenticity = $('input[name="authenticity_token"]')[0].attribs.value
    var oauth = $('input[name="oauth_token"]')[0].attribs.value

    var tokens = {
        authenticity_token: authenticity
      , oauth_token: oauth
    }
    cb(err, tokens)
  })
}

function getTwitterLogin (cb) {
  var url = 'http://plug.dj/authenticate/oauth/?next=http%3A%2F%2Fplug.dj%2F'

  opts = {
      url: url
    , form: { provider: 'twitter' }
  }

  request.post(opts, function (err, res, body) {
    cb(err, res.headers.location)
  })
}