const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const communitySchema = new Schema({
  "@context": { type: String, value: "url/community.jsonld" },
  "@type": { type: String, value: "Community" }, // Organization
  ct: {
    type: String,
    value: "bunity/community",
  },
  isPublic: Boolean,
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
    },
  ],
  creator: {
    "@type": { type: String, value: "ct:creator" },
    "@id": String,
  },
  organizers: [
    {
      "@type": { type: String, value: "ct:organizer" },
      "@id": String,
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
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
