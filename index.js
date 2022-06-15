const http = require("http");
const crypto = require("crypto");

const tunnelMap = new Map();

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const getSecWebsocketAccept = (challange) =>
  crypto
    .createHash("sha1")
    .update(challange + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");

const getUpgradeReplay = (secWebSocketAccept) =>
  "HTTP/1.1 101 Switching Protocols\r\n" +
  "Upgrade: websocket\r\n" +
  "Connection: Upgrade\r\n" +
  `Sec-WebSocket-Accept: ${secWebSocketAccept}\r\n` +
  "\r\n";

const getErrorReplay = (message) => `HTTP/1.1 400 ${message}\r\n\r\n`;

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World");
});

server.on("upgrade", async (req, socket, head) => {
  // console.log('upgrade request recived', req, socket)
  console.log(req.url);
  return;
  const tunnelId = uuidv4();

  if (request.url.includes("lambda")) {
    socket.write(
      getUpgradeReplay(getSecWebsocketAccept(req.headers["sec-websocket-key"]))
    );
  }
  if (request.url.includes("chrome")) {
    socket.write(
      getUpgradeReplay(getSecWebsocketAccept(req.headers["sec-websocket-key"]))
  );

    // socket.on("close", () => {
    //   log("close");
    //   () => {
    //     log(`tunnelId: ${tunnelId} onTunnelTermination`);
    //     tunnelMap.delete(tunnelId);
    //   }
    // });

    tunnelMap.set(tunnelId, socket);
  }

  if (request.url.indexOf("lambda") !== -1) {
  }
});

const PORT = 3001;
server.listen(PORT);
console.log(`Server running on port ${PORT}`);
