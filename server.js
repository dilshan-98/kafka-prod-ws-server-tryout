const WebSocket = require("ws");
const { v4: uuid } = require("uuid");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

async function checkItem(id) {
  const params = {
    TableName: "MSK-ConnectionID-table",
    Key: {
      connectionID: id,
    },
    AttributesToGet: ["connectionID"],
  };

  return await docClient.get(params).promise();
}

async function createItem(id, chapterId) {
  const params = {
    TableName: "MSK-ConnectionID-table",
    Item: {
      connectionID: id,
      chapterID: chapterId,
    },
  };

  return await docClient.put(params).promise();
}

const WS_PORT = 3001;

const idMap = new Map();

const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`Listening on PORT ${WS_PORT} for websockets`);
});

wss.on("connection", async (ws, req) => {
  ws.uuid = uuid();
  idMap.set(ws.uuid, ws);

  const checkId = await checkItem(ws.uuid);
  console.log(checkId.Item);

  if (!checkId.Item) {
    await createItem(ws.uuid, ws)
      .then(() => {
        callback(null, {
          statusCode: 201,
          body: "",
        });
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(ws.uuid + " - done");
  }

  ws.send(
    "Welcome to the websocket server! ws uuid: " + ws.uuid + " ws: " + ws
  );

  console.log(req.url);

  ws.on("message", (msg) => {
    console.log("DATA", msg.toString());
  });

  ws.on("close", (e) => {
    idMap.delete(ws.uuid);
    console.log("Websocket: KILLED");
  });
});
