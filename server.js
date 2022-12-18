const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const WS_PORT = 3001

const idMap = new Map();

const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`Listening on PORT ${WS_PORT} for websockets`);
})

wss.on('connection', (ws, req) => {
  ws.uuid = uuid();
  idMap.set(ws.uuid, ws);

  ws.send('Welcome to the websocket server!'+ws.uuid);

  console.log(req.url)

  ws.on('message', (msg) => {
    console.log('DATA', msg.toString());
  })

  ws.on('close', (e) => {
    idMap.delete(ws.uuid);
    console.log('Websocket: KILLED');
  })
})