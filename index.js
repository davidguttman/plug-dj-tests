var http = require('http')
var uuid = require('uuid')
var request = require('request')
var cheerio = require('cheerio')
var WebSocket = require('ws')

var calc = require('./calculator')

var PlugAPI = require('plugapi')

var botName = 'MrVisuals'
var auth = 'xxxxx'
var room = 'chillout-mixer-ambient-triphop'
// var room = 'the-chillout-mixer'

var opts = {
    url: 'https://sio2.plug.dj/socket.io/1/?t=' + Date.now()
  , headers: {
      Cookie: 'usr="'+auth+'"'
  }
}

function joinRoom (ws, roomName) {
  var roomOpts = {
      name: 'join'
    , args: [roomName]
  }
  ws.send('5::/room:'+JSON.stringify(roomOpts))
}

function speak (ws, message) {
  var cid = uuid.v4().replace(/-/g,'').substr(0, 13)
  var message = {
      name: 'chat'
    , args: [{
        msg: message
      , chatID: cid
    }]
  }
  ws.send('5::/room:'+JSON.stringify(message))
}

function onMessage (ws, message) {
  console.log('message', message);
  if (message.from !== botName) {
    var re = /mrvisuals:?\s*/
    if (message.message.toLowerCase().match(re)) {
      var content = message.message.toLowerCase().split(re)[1]
      var result = calc(content)
      if (result) {
        speak(ws, result)  
      }
      
    }
  }
}

request(opts, function(err, res, body) {
  var sockId = body.split(':')[0]
  var sockUrl = 'wss://sio2.plug.dj/socket.io/1/websocket/' + sockId
  var ws = new WebSocket(sockUrl)
  ws.on('open', function() {
    ws.send('1::/room')

    joinRoom(ws, room)
    // speak(ws, 'hello, I am a bot')
  })
  ws.on('message', function(data, flags) {
    console.log('data', data);
    if (data == '2::') {
      ws.send('2::')
    }
    if (data.match(/^5::\/room:/)) {
      var mStr = data.split('5::/room:')[1]
      var m = JSON.parse(mStr).args[0]
      if (m.type === 'message') {
        onMessage(ws, m)  
      }
      
    }
  })
})

// var bot = new PlugAPI(auth)
// bot.connect(room)

// bot.on('connected', function() {
//   console.log('connected!');
//   bot.client.on('data', function(data) {
//     console.log('data', data);
//   })
// })

// bot.on('chat', function(data) {
//   console.log('chat', data);
// })

// bot.on('data', function(data) {
//   console.log('data', data);
// })

//////////////////

// var plugLogin = require('./plug-login')

// var creds = {
//     username: 'xxx'
//   , password: 'xxx'
// }

// plugLogin(creds, function(err, jar, cookies) {
//   console.log('jar', jar);
//   var cookie = jar.cookies.filter(function(cookie) {
//     if (cookie.name === 'usr') return true
//   })[0]
//   var cookieVal = cookie.value
//   console.log('cookieVal', cookieVal);

  
// })