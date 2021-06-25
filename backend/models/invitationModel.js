const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const invitationSchema = new Schema({
    from: {
      community: mongoose.Schema.Types.ObjectId,
      communityName: String
    },
    to:{
        user: mongoose.Schema.Types.ObjectId,
        "@type": { type: String, value: "sc:Person" },
        "@id": String,
    },
    status: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  });
  
  const Invitation = mongoose.model("Invitation", invitationSchema);
  
  module.exports = Invitation;