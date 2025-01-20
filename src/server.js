import http from "node:http";

const server = http.createServer((req, res) => {
  return res.writeHead(404).end("Not Found");
});

server.listen(3333);
