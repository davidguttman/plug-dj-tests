var plugLogin = require('../plug-login')

var creds = {
    username: 'xxx'
  , password: 'yyy'
}

plugLogin(creds, function(err, jar) {
  if (err) {console.error(err)}
  // console.log('jar', jar);
  var cookie = jar.cookies.filter(function(cookie) {
    if (cookie.name === 'usr') return true
  })[0]
  var cookieVal = cookie.value
  console.log('cookieVal', cookieVal);
})