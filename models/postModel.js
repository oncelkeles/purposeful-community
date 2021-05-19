const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  "@context": String,
  "@type": String, // Post
  //"@id": String, // url
  about: {
    "@type": String, // Relation,
    community: {
      "@type": String, // organization
      value: {
        type: mongoose.Schema.ObjectId,
        ref: "Community",
      },
    },
    creator: {
      "@type": String, // person
      value: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
    postType: {
      "@type": String, // PostType
      value: {
        type: Schema.ObjectId,
        ref: "PostType",
      },
    },
  },
  name: {
    "@type": String, // PostFieldItem
    value: {
      type: String,
      required: [true, "A postType must have a name!"],
      unique: true,
    },
  },
  description: {
    "@type": String, // PostFieldItem
    value: {
      type: String,
    },
  },
  tags: {
    "@type": String, // PostFieldItem
    value: {
      type: [String],
    },
  },
  postFields: [
    {
      "@type": String, // PostFieldItem
      value: {
        title: String,
        value: Object,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
