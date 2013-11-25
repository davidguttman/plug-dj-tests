var uuid = require('uuid')
var request = require('request')
var WebSocket = require('ws')

var botName = 'MrVisuals'
var room = 'chillout-mixer-ambient-triphop'
var auth = 'xxx'

var opts = {
    url: 'https://sio2.plug.dj/socket.io/1/?t=' + Date.now()
  , headers: {
      Cookie: 'usr='+auth
  }
}

request(opts, function(err, res, body) {
  if (err) {console.error(err)}

  var sockId = body.split(':')[0]
  var sockUrl = 'wss://sio2.plug.dj/socket.io/1/websocket/' + sockId
  var ws = new WebSocket(sockUrl)

  ws.on('open', function() {
    ws.send('1::/room')

    joinRoom(ws, room)
    speak(ws, 'bot testing')
  })
  
  ws.on('message', function(data, flags) {
    // log all data
    console.log('data', data);

    // heartbeat
    if (data == '2::') ws.send('2::')

    // other messages (including chat)
    if (data.match(/^5::\/room:/)) {
      var mStr = data.split('5::/room:')[1]
      var m = JSON.parse(mStr).args[0]
      
      // chat messages
      if (m.type === 'message') onMessage(ws, m)  
      
    }
  })
})

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
  console.log('message received', message);
}