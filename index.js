var request = require('request')

getTwitterLogin(function(err, location) {
  console.log('location', location);
})

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