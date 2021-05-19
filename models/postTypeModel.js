const mongoose = require("mongoose");

/* const Type = require("./typeModel");

const {
  stringType,
  numberType,
  linkType,
  radioType,
  checkboxType,
  dateType,
  imageUriType,
  mixedType,
} = Type; */

const postTypeSchema = new mongoose.Schema({
  "@context": String,
  "@type": String, // post type
  about: {
    "@type": String, // relation
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
  },
  name: {
    "@type": String, // PostTypeFieldItem
    value: {
      type: String,
      required: [true, "A postType must have a name!"],
      unique: true,
    },
  },
  description: {
    "@type": String, // PostTypeFieldItem
    value: {
      type: String,
    },
  },
  tags: {
    "@type": String, // PostTypeFieldItem
    value: {
      type: [String],
    },
  },
  postTypeFields: [
    {
      "@type": String, // PostTypeFieldItem
      value: {
        title: String,
        isRequired: Boolean,
        isEditable: Boolean,
        dataType: String, // HOCAYA SOR, RADIO OLSA NASIL TUTUCAZ??
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const PostType = mongoose.model("PostType", postTypeSchema);

module.exports = PostType;
