const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  "@context": { type: String, value: "url/communityData.jsonld" },
  "@type": { type: String, value: "CommunityData" },
  cd: {
    type: String,
    value: "bunity/CommunityData",
  },
  title: {
    type: String,
    required: [true, "A community data must have a title!"],
  },
  description: String,
  tags: [String],
  creator: {
    "@type": { type: String, value: "cd:creator" },
    "@id": String,
  },
  community: {
    "@type": { type: String, value: "cd:creator" },
    "@id": String,
  },
  communityDataType: {
    "@type": { type: String, value: "cd:communityDataType" },
    "@id": String,
  },
  postFields: [
    {
      "@type": { type: String, value: "cd:communityData" },
      label: String,
      value: Object,
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
