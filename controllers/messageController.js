const catchAsync = require("./../utili/catchAsync");
const Message = require("./../models/messageModel");
const User = require("./../models/userModel");

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find();

  res.status(200).json({
    status: "success",
    data: {
      messages,
    },
  });
});
exports.getTheContactMessages = catchAsync(async (req, res, next) => {
  const messages = req.user.messages;
  console.log(messages);
  const receiverId = req.params.id;
  let messageOfContact = [];

  await Promise.all(
    messages.map(async (msgId) => {
      let message = await Message.find({
        $and: [
          { _id: msgId },
          { $or: [{ sender: req.user._id }, { reciever: req.user._id }] },
          { $or: [{ sender: receiverId }, { reciever: receiverId }] },
        ],
      });
      //   let message = await Message.findById(msgId);
      if (message) {
        messageOfContact.push(message);
      }
      console.log(message);
    })
  );
  res.status(200).json({
    status: "success",
    data: messageOfContact,
  });
  // const message = await
});

exports.createNewMessage = catchAsync(async (req, res, next) => {
  // 1) Get the Receiver ID.
  let receiverId = req.params.id;
  // 2) Get the Sender ID.
  let senderId = req.user._id;
  // 3) Store the sender Id in message send.
  req.body.sender = senderId;
  // 4) Store the receiver Id in message recive.
  req.body.reciever = receiverId;
  // 5) Push the message in user message field.
  const message = await Message.create(req.body);
  const currentUser = await User.findByIdAndUpdate(req.user._id, {
    $push: { messages: message },
  });

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});
