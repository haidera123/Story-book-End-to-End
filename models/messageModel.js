const mongoose = require("mongoose");
const moment = require("moment");

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Write your message"],
  },
  //   comments: [{type: mongoose.Schema.ObjectId, ref: "Comment" }],
  sender: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  reciever: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  time: { type: String, default: moment().format("h:mm a") },
});

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender reciever",
    // select:''
  });
  next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
