// Imports:
const express = require(`express`);
const postsRouter = require(`./routers/posts-router.js`);

// Declarations:
const server = express();

// Express Middleware:
server.use(express.json());
server.use(`/api/posts`, postsRouter);

// Generic Routing Handlers:
server.get(`/api`, (request, response) => {
  response.send(`
      <h1>Web API II Challenge</h1>
      <p>Please see the <a href='https://github.com/ericlugo/webapi-ii-challenge'>README</a> for more information on where to go!</p>
    `);
});

module.exports = server;
