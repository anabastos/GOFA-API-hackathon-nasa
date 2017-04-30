import Post from '../../models/post';

export async function createPost(post) {

  try {

    post = new Post(post);

    return await post.save();

  } catch (err) {

    err.error = true;
    return err;

  }

}

export async function getPosts() {

  try {

    return await Post.find({});

  } catch (err) {

    err.error = true;
    return err;

  }

}