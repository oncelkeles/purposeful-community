const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const communitySchema = new Schema({
  "@context": String,
  "@type": String, // Organization
  isPublic: Boolean,
  name: {
    "@type": String, // CommunityField
    value: {
      type: String,
      required: [true, "A community must have a name!"],
      unique: true,
    },
  },
  description: {
    "@type": String, // CommunityField
    value: {
      type: String,
    },
  },
  tags: {
    "@type": String, // CommunityField
    value: [String],
  },
  members: [
    {
      "@type": String, // Person
      value: {
        type: Schema.ObjectId,
        ref: "User",
      },
    },
  ],
  creator: {
    "@type": String, // Person
    value: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  organizers: [
    {
      "@type": String, // Person
      value: {
        type: Schema.ObjectId,
        ref: "User",
      },
    },
  ],
  //postTypes:
  // posts:
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
