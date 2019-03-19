const UUID = require('uuid');
const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({ port: 8080 });
console.log("listening port 8080");

//广播处理函数
wss.broadcast = function (request = {}) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(request));
  });
}

wss.on("connection", (ws) => {
  ws.uuid = UUID.v1();
  //广播上线消息
  wss.broadcast({id:ws.uuid,message:"上线",state:"online"});

  ws.on("message", (message) => {
    console.log('received :%s', message);
    //广播群消息
    wss.broadcast({id:ws.uuid,"message": message,state:"speaking"});
  });

  //广播退出消息
  ws.on("close", () => {
    wss.broadcast({id:ws.uuid,message:"退出",state:"cancel"});
  })
});