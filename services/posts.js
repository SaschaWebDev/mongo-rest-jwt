const Posts = require("../models/posts.js");

module.exports = {
  findAll,
  findByPostId,
  createPost,
  updatePost,
  removePost,
};

async function findAll() {
  return await Posts.find();
}

async function findByPostId(id) {
  return await Posts.findById(id);
}

async function createPost(post_object) {
  const post = new Posts({
    text: post_object.text,
    date: post_object.date,
    photo: post_object.photo,
    user_id: post_object.user_id,
  });
  return await post.save();
}

async function updatePost(id, post_object) {
  let foundPost = await findByPostId(id);
  if (foundPost == null) {
    return null;
  }

  if (post_object.text != null) {
    foundPost.text = post_object.text;
  }

  if (post_object.date != null) {
    foundPost.date = post_object.date;
  }

  if (post_object.photo != null) {
    foundPost.photo = post_object.photo;
  }

  if (post_object.user_id != null) {
    foundPost.user_id = post_object.user_id;
  }

  return await foundPost.save();
}

async function removePost(id) {
  return await Posts.findByIdAndRemove(id);
}
