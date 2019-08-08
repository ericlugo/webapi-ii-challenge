const server = require(`./server.js`);

const port = 4000;

server.listen(port, (_) => {
  console.log(`\n*** server listening on localhost:${port} ***\n`);
});
