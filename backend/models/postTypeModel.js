const mongoose = require("mongoose");

const postTypeSchema = new mongoose.Schema({
  "@context": { type: String, value: "url/communityDataType.jsonld" },
  "@type": { type: String, value: "CommunityDataType" }, // post type,
  "@id": {
    type: String,
  },
  incrementing: 0,
  cdt: {
    type: String,
    value: "bunity/CommunityDataType",
  },
  title: {
    type: String,
    required: [true, "A community data type must have a name!"],
  },
  description: String,
  tags: [String],
  creator: {
    "@type": { type: String, value: "cdt:creator" },
    "@id": String,
  },
  communityDataTypeFields: [
    {
      "@type": { type: String, value: "cdt:communityDataTypeField" },
      fieldName: String,
      fieldIsRequired: Boolean,
      fieldIsEditable: Boolean,
      fieldType: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const PostType = mongoose.model("PostType", postTypeSchema);

module.exports = PostType;
