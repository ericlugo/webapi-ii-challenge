const express = require(`express`);
const db = require(`../data/db.js`);
const responseHandler = require(`../snippets/responseHandler.js`);

const router = express.Router();

router.post(``, async (request, response) => {
  const { title, contents } = request.body;
  if (!title || !contents) responseHandler(response, false, 400, { error: `Please provide title and contents for the post.` });
  else {
    try {
      const postResponse = await db.insert(request.body);
      const post = await db.findById(postResponse.id);
      responseHandler(response, true, 201, { post });
    } catch {
      responseHandler(response, false, 500, { error: `There was an error while saving the post to the database` });
    }
  }
});

router.post(`/:id/comments`, async (request, response) => {
  const { text } = request.body;
  if (!text) responseHandler(response, false, 400, { error: `Please provide text for the comment.` });
  else {
    try {
      const post = await db.findById(request.params.id);
      if (post[0]) {
        try {
          const commentResponse = await db.insertComment({ text, post_id: request.params.id });
          const comment = await db.findCommentById(commentResponse.id);
          responseHandler(response, true, 201, { comment: comment[0] });
        } catch {
          responseHandler(response, false, 500, { error: `There was an error while saving the comment to the database.` });
        }
      } else responseHandler(response, false, 404, { error: `The post with the specified ID does not exist.` });
    } catch {
      responseHandler(response, false, 500, { error: `The post information could not be retrieved.` });
    }
  }
});

router.get(``, async (request, response) => {
  try {
    const posts = await db.find();
    responseHandler(response, true, 200, { posts });
  } catch {
    responseHandler(response, false, 500, { error: `The posts information could not be retrieved.` });
  }
});

router.get(`/:id`, async (request, response) => {
  try {
    const post = await db.findById(request.params.id);
    post[0]
      ? responseHandler(response, true, 200, { post: post[0] })
      : responseHandler(response, false, 404, { error: `The post with the specified ID does not exist.` });
  } catch {
    responseHandler(response, false, 500, { error: `The post information could not be retrieved.` });
  }
});

router.get(`/:id/comments`, async (request, response) => {
  try {
    const post = await db.findById(request.params.id);
    if (post[0])
      try {
        const comments = await db.findPostComments(request.params.id);
        responseHandler(response, true, 200, { comments });
      } catch {
        responseHandler(response, false, 500, { error: `The comments information could not be retrieved.` });
      }
    else responseHandler(response, false, 404, { error: `The post with the specified ID does not exist.` });
  } catch {
    responseHandler(response, false, 500, { error: `The post information could not be retrieved.` });
  }
});

router.put(`/:id`, async (request, response) => {
  const { title, contents } = request.body;
  if (!title && !contents) responseHandler(response, false, 400, { error: `Please provide title or contents for the post.` });
  else {
    try {
      const post = await db.findById(request.params.id);
      if (post[0])
        try {
          const updateResponse = await db.update(request.params.id, request.body);
          if (updateResponse === 1) {
            const updatedPost = await db.findById(request.params.id);
            responseHandler(response, true, 200, { updatedPost: updatedPost[0] });
          } else responseHandler(response, false, 500, { error: `The post information could not be modified.` });
        } catch {
          responseHandler(response, false, 500, { error: `The post information could not be modified.` });
        }
      else responseHandler(response, false, 404, { error: `The post with the specified ID does not exist.` });
    } catch {
      responseHandler(response, false, 500, { error: `The post information could not be retrieved.` });
    }
  }
});

router.delete(`/:id`, async (request, response) => {
  try {
    const post = await db.findById(request.params.id);
    if (post[0])
      try {
        const removeResponse = await db.remove(request.params.id);
        removeResponse && responseHandler(response, true, 200, { deletedPost: post[0] });
      } catch {
        responseHandler(response, false, 500, { error: `The post could not be removed.` });
      }
    else responseHandler(response, false, 404, { error: `The post with the specified ID does not exist.` });
  } catch {
    responseHandler(response, false, 500, { error: `The post information could not be retrieved.` });
  }
});

module.exports = router;
