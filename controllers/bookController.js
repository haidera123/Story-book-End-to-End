const AppError = require("../utili/appError");
const Book = require("./../models/bookModel");
const catchAsync = require("./../utili/catchAsync");
const fs = require("fs");

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).send({
    status: "success",
    result: books.length,
    data: { books },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError(`No tour with that ID`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.createBook = catchAsync(async (req, res) => {
  const newBook = await Book.create(req.body);
  newBook.getWriterIdAndAssign(req.user._id);
  await newBook.save();
  // newBook.assignWriterID(req.user._id);
  res.status(201).json({
    status: "success",
    data: {
      book: newBook,
    },
  });
});

exports.updateBook = catchAsync(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    return next(new AppError(`No tour with that ID`, 404));
  }
  res.status(200).json({
    status: "sucess",
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  book.deleteBookIdFromWriter(req.user);

  if (!book) {
    return next(new AppError(`No book with that ID`, 404));
  }
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});
