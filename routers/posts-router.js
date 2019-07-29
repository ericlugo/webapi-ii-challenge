const express = require(`express`);
const db = require(`../data/db.js`);

const router = express.Router();

router.post(``, async (request, response) => {
  const { title, contents } = request.body;

  if (!title || !contents) {
    response.status(400).json({
      success: false,
      error: `Please provide title and contents for the post.`,
    });
  } else {
    try {
      const postResponse = await db.insert(request.body);
      const post = await db.findById(postResponse.id);
      response.status(201).json({
        success: true,
        post,
      });
    } catch {
      response.status(500).json({
        success: false,
        error: `There was an error while saving the post to the database`,
      });
    }
  }
});

router.post(`/:id/comments`, async (request, response) => {
  const { text } = request.body;

  if (!text) {
    response.status(400).json({
      success: false,
      error: `Please provide text for the comment.`,
    });
  } else {
    try {
      const post = await db.findById(request.params.id);
      if (post[0]) {
        try {
          const commentResponse = await db.insertComment({ text, post_id: request.params.id });
          const comment = await db.findCommentById(commentResponse.id);
          response.status(201).json({
            success: true,
            comment,
          });
        } catch {
          response.status(500).json({
            success: false,
            error: `There was an error while saving the comment to the database.`,
          });
        }
      } else {
        response.status(404).json({
          success: false,
          error: `The post with the specified ID does not exist.`,
        });
      }
    } catch {
      response.status(500).json({
        success: false,
        error: `The post information could not be retrieved.`,
      });
    }
  }
});

router.get(``, async (request, response) => {
  try {
    const posts = await db.find();
    response.status(200).json({
      success: true,
      posts,
    });
  } catch {
    response.status(500).json({
      success: false,
      error: `The posts information could not be retrieved.`,
    });
  }
});

router.get(`/:id`, async (request, response) => {
  try {
    const post = await db.findById(request.params.id);
    post[0]
      ? response.status(200).json({
          success: true,
          post: post[0],
        })
      : response.status(404).json({
          success: false,
          error: `The post with the specified ID does not exist.`,
        });
  } catch {
    response.status(500).json({
      success: false,
      error: `The post information could not be retrieved.`,
    });
  }
});

router.get(`/:id/comments`, async (request, response) => {
  try {
    const post = await db.findById(request.params.id);
    if (post[0])
      try {
        const comments = await db.findPostComments(request.params.id);
        response.status(200).json({
          success: true,
          comments,
        });
      } catch {
        response.status(500).json({
          success: false,
          error: `The comments information could not be retrieved.`,
        });
      }
    else {
      response.status(404).json({
        success: false,
        error: `The post with the specified ID does not exist.`,
      });
    }
  } catch {
    response.status(500).json({
      success: false,
      error: `The post information could not be retrieved.`,
    });
  }
});

router.put(`/:id`, async (request, response) => {
  const { title, contents } = request.body;

  if (!title && !contents) {
    response.status(400).json({
      success: false,
      error: `Please provide title or contents for the post.`,
    });
  } else {
    try {
      const post = await db.findById(request.params.id);
      if (post[0])
        try {
          const updateResponse = await db.update(request.params.id, request.body);
          if (updateResponse === 1) {
            const updatedPost = await db.findById(request.params.id);
            response.status(200).json({
              success: true,
              updatedPost,
            });
          } else {
            response.status(500).json({
              success: false,
              error: `The post information could not be modified.`,
            });
          }
        } catch {
          response.status(500).json({
            success: false,
            error: `The post information could not be modified.`,
          });
        }
      else {
        response.status(404).json({
          success: false,
          error: `The post with the specified ID does not exist.`,
        });
      }
    } catch {
      response.status(500).json({
        success: false,
        error: `The post information could not be retrieved.`,
      });
    }
  }
});

router.delete(`/:id`, async (request, response) => {
  try {
    const post = await db.findById(request.params.id);
    if (post[0])
      try {
        const removeResponse = await db.remove(request.params.id);
        console.log(removeResponse);
        removeResponse &&
          response.status(200).json({
            success: true,
            deletedPost: post,
          });
      } catch {
        response.status(500).json({
          success: false,
          error: `The post could not be removed.`,
        });
      }
    else {
      response.status(404).json({
        success: false,
        error: `The post with the specified ID does not exist.`,
      });
    }
  } catch {
    response.status(500).json({
      success: false,
      error: `The post information could not be retrieved.`,
    });
  }
});

module.exports = router;
