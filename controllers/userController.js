const User = require("./../models/userModel");
const catchAsync = require("./../utili/catchAsync");
const Publisher = require("./../models/publisherModel");
const Book = require("./../models/bookModel")
const multer = require("multer");
const moment = require("moment");
// const sharp = requisre("sharp");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/img/users/`);
  },
  filename: function (req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("img");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).send({
      status: "success",
      result: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This is route is not yet defined",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This is route is not yet defined",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This is route is not yet defined",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This is route is not yet defined",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  if (!req.file) {
    req.body.img = req.user.img;
  } else {
    req.body.img = req.file.filename;
  }

  const id = req.params.id;
  const user = await User.findByIdAndUpdate(id, req.body);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.makeNewConnection = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByIdAndUpdate(id, {
    $push: { connections: req.user._id },
  });
  const currentUser = await User.findByIdAndUpdate(req.user._id, {
    $push: { connections: id },
  });
  res.status(200).json({
    status: "success",
    data: {
      from: currentUser,
      to: user,
    },
  });
});

exports.registerPublisher = catchAsync(async (req, res, next) => {
  if (!req.file) {
    req.body.img = "Coverimg.jpg";
  } else {
    req.body.img = req.file.filename;
  }
  const { name, subtitle, email, phone, address, country } = req.body;
  const publisher = await Publisher.create({ name, subtitle, email, phone, address, country });
  const user = await User.findByIdAndUpdate(req.user._id, {
    about: req.body.about,
    publisherId: publisher._id,
  });

  res.status(201).json({
    status: "success",
    data: publisher,
  });
});

exports.getAllPublishers = catchAsync(async (req,res,next)=>{
  const publishers = await Publisher.find();
  res.status(200).json({
    status:"success",
    data:publishers
  });
});

exports.sendTheBookRequest = catchAsync(async (req,res,next)=>{
  // 1. Get the publisher and book Id.
  const publisherId  = req.body.publisherId;
  const bookId = req.body.bookId;
  // 2. Push the bookId into publisher Id.
  const publisher = await Publisher.findById(publisherId);
  const books = publisher.bookSend;
  const book = await Book.findById(bookId);
  let isSend = false;
  let ind;
  books.forEach((pubBookId, index) => {
    console.log(pubBookId._id + "==>" + bookId)
    
    if (pubBookId._id.toString() == bookId.toString()) {
      console.log(pubBookId._id.toString() == bookId.toString())
      isSend = true;
    } else {
      ind = index;
    }
  });
  if (!isSend) {
    publisher.bookSend.push(bookId);
    book.publishStatus = 'pending';

  } else {
    publisher.bookSend.splice(ind, 1);
    book.publishStatus = 'writing';

  }
  publisher.save({validateBeforeSave:false});
  book.save({validateBeforeSave:false});
  // 3. Send the response to the user
  res.status(200).json({
    status:"success",
    data: publisher
  });
})

exports.publishTheBook = catchAsync(async(req,res,next)=>{
  // 1) Get the book and publisher ID.
  const bookId = req.params.id;
  const publisherId = req.user._id;
  // 2) Update the book publication status to publish.
  const book = await Book.findByIdAndUpdate(bookId, {
    publishStatus:"published",
    publisher:req.user.publisherId,
    publicationDate:moment(new Date()).format("DD/MM/YYYY")
  });
  // 3) Send the response to client.
  res.status(200).json({
    status:"success",
    data:book
  }); 
});