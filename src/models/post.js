import mongoose from 'mongoose'

const Post = new mongoose.Schema({
  user: { type: String },
  message: { type: String }
});


export default mongoose.model('post', Post)