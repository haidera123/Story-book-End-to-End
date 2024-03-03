const express = require("express");
const authController = require("./../controllers/authController");
const Book = require("./../models/bookModel");
const Post = require("./../models/postModel");
const User = require("./../models/userModel");
const fs = require("fs");
const Publisher = require("./../models/publisherModel");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/login", (req, res) => {
  if(req.user){
   return res.redirect('/');
  }
  res.status(200).render("registration/login", { title: "login", layout: "registration/layout" });
});
router.get("/signup", (req, res) => {
  res.render("registration/signup", { title: "signup", layout: "registration/layout" });
});
router.get("/", async (req, res) => {
  if(!req.user){
    return res.redirect('/login');
  }
  if (req.user.role == "publisher" && !req.user.publisherId) {
    res.render("profileConfiguration/publisher__form", {
      title: "Publisher form",
      layout: "profileConfiguration/layout",
    });
  } else {
    try {
      const posts = await Post.find().sort({ noOfLikes: -1 });
      res.render("social_media/home", { title: "Home", posts, layout: "social_media/layout" });
    } catch (err) {
      res.status(500).json({
        status: fail,
        data: err,
      });
    }
  }
});
router.get("/publiserdashboard",async (req, res) => {
 try{
  const publisherId = req.user.publisherId;
  const publisher = await Publisher.findById(publisherId);
  console.log('00000000000000000000000');
  console.log('00000000000000000000000');
  console.log('00000000000000000000000');
  console.log(publisherId);
  console.log(publisher);
  console.log('00000000000000000000000');
  console.log('00000000000000000000000');
  console.log('00000000000000000000000');
  const books = publisher.bookSend;
  let authors = [];
  await Promise.all(books.map(async (bk)=>{
   console.log('///////////////////////////////////////////')
    console.log(bk);
  const author = await User.findById(bk.writer);
    authors.push(author);
  }));
  // console.log(publisher);
  // console.log(authors);
  res.render("publisher_dashboard/dashboard", {
    title: "Publisher dashboard",
    books,
    authors,
    layout: "publisher_dashboard/layout",
  });
 }catch(err){
  console.log(err); 
  res.status(500).json({
     status:"error",
     data:err
   });
 }
  
});
router.get("/publisherForm", (req, res) => {
  if (!req.user.publisher && req.user.role == "publisher") {
    res.render("profileConfiguration/publisher__form", {
      title: "Publisher form",
      layout: "profileConfiguration/layout",
    });
  } else {
    res.redirect("/");
  }
});
router.get("/user/:id", async (req, res) => {
  // userProfile
  const user = await User.findById(req.params.id);
  res.render("social_media/userProfile", {
    title: "userProfile",
    userData: user,
    layout: "social_media/layout",
  });
});
router.get("/publisher/:id", async (req, res) => {
  // userProfile
  const user = await User.findById(req.params.id);
  const publisher = await Publisher.findById(user.publisherId);
  res.render("social_media/publisherLandingPage", {
    title: "Publisher",
    userData: user,
    publisherData: publisher,
    layout: "social_media/layout",
  });
});
function checkIfLoggedIn(req, res, next) {
  if (!req.user) {
    return res.redirect(`/`);
  }
  next();
}
// Profile configuration
router.get("/settings/:id", (req, res) => {
  res.render("profileConfiguration/profile", {
    title: "profile configuration",
    layout: "profileConfiguration/layout",
  });
});

// Writing tool routers
router.get("/createbook", checkIfLoggedIn, (req, res) => {
  if (req.user.books.length != 0) {
    res.locals.book = req.user.books[0];
    res.redirect(`/bookshelf/${req.user.books[0]._id}`);
  } else {
    return res.render("writing-tool/welcomePage", {
      title: "Create Book",
      layout: "writing-tool/layout",
    });
  }
});
router.get("/createnewbook", checkIfLoggedIn, (req, res) => {
  console.log(req.user);

  res.render("writing-tool/welcomePage", {
    title: "Create Book",
    bookId: 0,
    layout: "writing-tool/layout",
  });
});
// router.get("/writingtool/:id", (req, res) => {
//   res.render("writing-tool/writingworkspace", {
//     title: "Writing workspace",
//     bookId: req.params.id,
//     layout: "writing-tool/layout",
//   });
// });
router.get("/readingroom/:id", checkIfLoggedIn, async (req, res) => {
  let id = req.params.id;
  const getBook = await Book.findById(id);

  fs.readFile(`./public/bookFilesScript/${getBook.script}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        status: "fail",
        message: "Something went wrong while reading the file!",
      });
    }
    const scriptJSON = JSON.parse(data);
    res.render("writing-tool/readingRoom", {
      title: "Reading Room",
      book: getBook,
      bookId: req.params.id,
      writingContent: scriptJSON,
      layout: "writing-tool/layout",
    });
  });
});



router.get("/message/:id", checkIfLoggedIn, async (req, res) => {
  try {
    let contacts = [];
    await Promise.all(
      req.user.connections.map(async (id) => {
        let user = await User.findById(id);
        console.log(user);
        contacts.push(user);
      })
    );
    console.log(req.user.connections);
    res.render("writing-tool/message", {
      title: "Message",
      contact: contacts,
      bookId: req.params.id,
      layout: "writing-tool/layout",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
    console.log(err);
  }
});
router.get("/bookshelf/:id", checkIfLoggedIn, (req, res) => {
  res.render("writing-tool/bookshelf", {
    title: "Book Shelf",
    bookId: req.params.id,
    layout: "writing-tool/layout",
  });
});
router.get("/character/:id", checkIfLoggedIn, async (req, res) => {
  const bookId = req.params.id;
  const getBook = await Book.findById(bookId);
  console.log(getBook);

  res.render("writing-tool/character", {
    title: "Character",
    bookId: req.params.id,
    book: getBook,
    layout: "writing-tool/layout",
  });
});
router.get("/selectbook/:id", checkIfLoggedIn, async (req, res) => {
  let id = req.params.id;
  const getBook = await Book.findById(id);
  res.locals.book = getBook;
  res.redirect(`/writingtool/${id}`);
});
router.get("/writingtool/:id", checkIfLoggedIn, async (req, res) => {
  let id = req.params.id;
  const getBook = await Book.findById(id);

  fs.readFile(`./public/bookFilesScript/${getBook.script}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        status: "fail",
        message: "Something went wrong while reading the file!",
      });
    }
    const scriptJSON = JSON.parse(data);
    res.render("writing-tool/writingworkspace", {
      title: "Writing workspace",
      book: getBook,
      bookId: req.params.id,
      writingContent: scriptJSON,
      layout: "writing-tool/layout",
    });
  });
});
router.get("/readingroomPublisher/:id", checkIfLoggedIn, async (req, res) => {
  let id = req.params.id;
  const getBook = await Book.findById(id);

  fs.readFile(`./public/bookFilesScript/${getBook.script}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        status: "fail",
        message: "Something went wrong while reading the file!",
      });
    }
    const scriptJSON = JSON.parse(data);
    res.render("publisher_dashboard/readingRoom", {
      title: "Reading Room",
      book: getBook,
      bookId: req.params.id,
      writingContent: scriptJSON,
      layout: "publisher_dashboard/layout",
    });
  });
});

router.get("/books",(req,res)=>{
  res.render("social_media/books",{
    title:"All Books",
    layout:"social_media/layout"
  })
})

module.exports = router;
