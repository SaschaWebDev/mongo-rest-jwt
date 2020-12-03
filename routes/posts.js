const express = require("express");
const router = express.Router();

const postsServices = require("../services/posts.js");
const { authorizeUser } = require("../middlewares/auth.js");
const { authorizeAdmin } = require("../middlewares/authAdmin.js");

// GET Alle Post durch Admin
router.get("/", authorizeAdmin, async (req, res) => {
  try {
    const posts = await postsServices.findAll();
    res.status(200).json({ posts: posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Post anhand von Post ID durch User
router.get("/:id", authorizeUser, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await postsServices.findByPostId(id);
    post
      ? res.status(200).json({ post: post })
      : res.status(404).json({ message: `Post ${id} wurde nicht gefunden.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Posterstellung durch User
router.post("/add", authorizeUser, async (req, res) => {
  try {
    const newPost = await postsServices.createPost(req.body);
    res.status(201).json({ post: newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Post bearbeiten durch User
router.post("/update/:id", authorizeUser, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    let updatedPost = await postsServices.updatePost(id, req.body);
    if (updatedPost == null) {
      res.status(404).json({ message: `Post ${id} wurde nicht gefunden!` });
    }
    res.status(200).json({ updatedpost: updatedPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE Post löschen durch User
router.delete("/:id", authorizeUser, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const removedPost = await postsServices.removePost(id);
    removedPost
      ? res.status(200).json({ deletedpost: removedPost })
      : res.status(404).json({ message: `Post ${id} wurde nicht gefunden.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
