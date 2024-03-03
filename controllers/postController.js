const catchAsync = require("./../utili/catchAsync");
const Post = require("./../models/postModel");
const User = require("./../models/userModel");

const multer = require("multer");
// const sharp = requisre("sharp");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/img/posts/`);
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

exports.uploadPostPhoto = upload.single("photo");

exports.createNewPost = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }
  req.body.user = req.user._id;
  const post = await Post.create(req.body);
  const user = await User.findById(req.user._id);
  user.posts.push(post._id);
  user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    status: "success",
    length: posts.length,
    data: {
      posts,
    },
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  console.log();
  const post = await Post.findById(req.params.id);
  const likeArray = post.likes;
  let isLike = false;
  let ind;
  console.log(likeArray);
  console.log(req.user._id);
  likeArray.forEach((likeId, index) => {
    if (likeId == req.user._id.toString()) {
      isLike = true;
    } else {
      ind = index;
    }
  });
  console.log(isLike);
  if (!isLike) {
    post.likes.push(req.user._id);
  } else {
    post.likes.splice(ind, 1);
  }
  post.noOfLikes = post.likes.length;
  post.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
  });
});
