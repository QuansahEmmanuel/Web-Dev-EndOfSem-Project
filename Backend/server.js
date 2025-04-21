const jsonServer = require("json-server");
const doevn = require("dotenv");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

doevn.config();
const port = process.env.PORT || 5000;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
