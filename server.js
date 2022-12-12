const WebSocket = require('ws')

const WS_PORT = 3001

const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`Listening on PORT ${WS_PORT} for websockets`);
})

wss.on('connection', (ws, req) => {

  ws.send('Welcome to the websocket server!');

  console.log(req.url)

  ws.on('message', (msg) => {
    console.log('DATA', msg.toString());
  })

  ws.on('close', (e) => {
    console.log('Websocket: KILLED');
  })
})