const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostModel',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },{collection:'comments'});
  

module.exports = mongoose.model('CommentModel',commentSchema)