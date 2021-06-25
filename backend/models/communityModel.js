const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const communitySchema = new Schema({
  "@context": { type: String, value: "url/community.jsonld" },
  "@type": { type: String, value: "Community" }, // Organization
  "@id": { type: String, value: "url" },
  ct: {
    type: String,
    value: "bunity/community",
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: [true, "A community  must have a name!"],
  },
  description: String,
  tags: [String],
  members: [
    {
      "@type": { type: String, value: "ct:member" },
      "@id": String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
  ],
  creator: {
    "@type": { type: String, value: "ct:creator" },
    "@id": String,
    id: String,
  },
  organizers: [
    {
      "@type": { type: String, value: "ct:organizer" },
      "@id": String,
      id: String,
    },
  ],
  communityDataTypes: [
    {
      "@type": { type: String, value: "ct:communityDataType" },
      "@id": String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostType",
    },
  ],
  posts: [
    {
      "@type": { type: String, value: "ct:communityData" },
      "@id": String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  joinRequests: [
    {
      user: mongoose.Schema.Types.ObjectId,
      status: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
