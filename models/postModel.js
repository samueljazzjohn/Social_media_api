const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
      },
    title: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: true
      },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        default: []
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommentModel',
        default: []
      }],
    created_at: {
      type: Date,
      default: Date.now
    }
  },{collection:'posts'});

  module.exports = mongoose.model("PostModel",postSchema)