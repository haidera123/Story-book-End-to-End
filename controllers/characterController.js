const catchAsync = require("./../utili/catchAsync");
const AppError = require("../utili/appError");
const Character = require("./../models/characterModel");
const Book = require("./../models/bookModel");
const multer = require("multer");
// const sharp = requisre("sharp");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/img/characters/`);
  },
  filename: function (req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}.${file.ext}`);
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

exports.uploadUserPhoto = upload.single("photo");

// exports.resizeUserPhoto = (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/characters/${req.file.filename}`);
//   next();
// };

exports.createNewCharacter = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  const data = req.body;
  console.log(req.file.filename);
  console.log("////////////////");
  data.photo = req.file.filename;
  console.log(data);
  console.log("////////////////");

  const bookId = req.params.id;
  data.name = data.name.toLowerCase();
  const character = await Character.create(data);
  console.log(character._id);
  character.updateBookId(bookId);
  await Book.findByIdAndUpdate(bookId, { $push: { characters: character._id } });

  res.status(201).json({
    status: "success",
    data: { character },
  });
});
exports.getAllCharacters = catchAsync(async (req, res, next) => {
  const characters = await Character.find();
  res.status(200).json({
    status: "success",
    length: characters.length,
    data: {
      characters,
    },
  });
});
exports.getTheCharacter = catchAsync(async (req, res, next) => {
  let characterId = req.params.chId;
  const character = await Character.findById(characterId);
  res.status(200).json({
    status: "success",
    data: {
      character,
    },
  });
});
exports.searchCharacterByName = catchAsync(async (req, res, next) => {
  let characterName = req.params.name;
  characterName = characterName.toLowerCase();
  const character = await Character.findOne({
    name: characterName,
    bookId: req.params.id,
  });
  res.status(200).json({
    status: "success",
    data: {
      character,
    },
  });
});
exports.suggestCharacters = catchAsync(async (req, res, next) => {
  let characterName = req.params.name;
  if (req.params.name) characterName = characterName.toLowerCase();
  let characters = await Character.find({
    name: { $regex: new RegExp("^" + characterName, "i") },
    bookId: req.params.id,
  });
  console.log(characters);
  characters = characters.slice(0, 10);
  res.status(200).json({
    status: "success",
    data: {
      characters,
    },
  });
});
