const fs = require("fs");
const catchAsync = require("./../utili/catchAsync");
const Book = require("./../models/bookModel");

const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/img/scenes/`);
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

exports.uploadScenePhoto = upload.single("scenePhoto");

exports.updateBookContent = (req, res) => {
  // Get chapter and scene Id
  let contentOfScene = req.body.content;
  // 2. Get the scene number and chapter number.
  let sceneNo = req.body.sceneNo * 1;
  let chapterNo = req.body.chapterNo * 1;
  let sceneName = req.body.sceneName;
  let sceneNote = req.body.sceneNote;
  console.log("//////////////////////////");
  console.log(req.body);
  console.log("//////////////////////////");

  let isShift = req.body.isShift;
  console.log(isShift);

  fs.readFile(`./public/bookFilesScript/${req.body.scriptName}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        status: "fail",
        message: "Something went wrong while reading the file!",
      });
    }
    let scriptJSON = JSON.parse(data);
    console.log(scriptJSON);
    // Check if chapter is already in file.
    if (scriptJSON[chapterNo - 1]) {
      // Check if scene exists
      console.log("Existing");
      if (scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1]) {
        // Update that Chapter.
        if (isShift) {
          let item = { content: contentOfScene.trim(), sceneName, sceneName, sceneNote: sceneNote };
          console.log("We are insder///////////////////");
          let newSceneArray = makeSpaceForArray(
            sceneNo - 1,
            scriptJSON[chapterNo - 1][`chapter${chapterNo}`],
            item
          );
          scriptJSON[chapterNo - 1][`chapter${chapterNo}`] = newSceneArray;
        } else {
          scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].content =
            contentOfScene.trim();
          scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].sceneName = sceneName;
          scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].sceneNote = sceneNote;
        }
      } else {
        // Create new Scene
        scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1] = new Object();
        scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].content =
          contentOfScene.trim();
        scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].sceneName = sceneName;
        scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].sceneNote = sceneNote;
      }
    } else {
      // Create new Chapter amd then create new Scene.
      scriptJSON[chapterNo - 1] = {};
      scriptJSON[chapterNo - 1][`chapter${chapterNo}`] = [{}];
      console.log("New");
      console.log(scriptJSON[chapterNo - 1]);
      scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].content = contentOfScene;
      scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].sceneName = sceneName;
      scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].sceneNote = sceneNote;
    }
    console.log(scriptJSON);
    let copyOfFile = scriptJSON;
    scriptJSON = JSON.stringify(copyOfFile);

    fs.writeFile(`./public/bookFilesScript/${req.body.scriptName}`, scriptJSON, function (err) {
      if (err) {
        console.log(err);
        res.status(200).json({
          status: "fail",
          message: "Something went wrong while writing the fille!",
        });
      }
      console.log("The file was saved!");
    });
    res.status(200).json({
      status: "success",
      message: "Book has been saved successfully!",
    });
  });
};
function makeSpaceForArray(ind, arr, item) {
  let scenes = arr;
  scenes.splice(ind, 0, item);
  return scenes;
}
exports.deleteScene = (req, res) => {
  // Get chapter and scene Id
  // 2. Get the scene number and chapter number.
  let sceneNo = req.body.sceneNo * 1;
  let chapterNo = req.body.chapterNo * 1;

  fs.readFile(`./public/bookFilesScript/${req.body.scriptName}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        status: "fail",
        message: "Something went wrong while reading the file!",
      });
    }
    let scriptJSON = JSON.parse(data);
    // Delete the scene if exists
    if (scriptJSON[chapterNo - 1]) {
      // Check if scene exists
      if (scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1]) {
        // Update that Chapter.
        // scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1] = null;
        scriptJSON[chapterNo - 1][`chapter${chapterNo}`].splice(sceneNo - 1, 1);
        // If the deleted scene was last scene of the chapter then delete the whole chapter.
        let deleteChapter = true;
        scriptJSON[chapterNo - 1][`chapter${chapterNo}`].forEach((sc) => {
          if (sc != null) {
            deleteChapter = false;
          }
        });
        if (deleteChapter) {
          // scriptJSON[chapterNo - 1] = null;
          scriptJSON.splice(chapterNo - 1, 1);
        }
      }
    }
    let copyOfFile = scriptJSON;
    scriptJSON = JSON.stringify(copyOfFile);

    fs.writeFile(`./public/bookFilesScript/${req.body.scriptName}`, scriptJSON, function (err) {
      if (err) {
        console.log(err);
        res.status(200).json({
          status: "fail",
          message: "Something went wrong while writing the fille!",
        });
      }
      console.log("The file was saved!");
    });
    res.status(200).json({
      status: "success",
      message: "Scene has been deleted!",
    });
  });
};

exports.updateScenePhoto = catchAsync(async (req, res,next) => {
  console.log(req.body);
  console.log(req.file);
  let sceneNo = req.body.sceneDetailsSceneno * 1;
  let chapterNo = req.body.sceneDetailsChapterno * 1;


  fs.readFile(`./public/bookFilesScript/${req.body.sceneDetailsScriptname}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        status: "fail",
        message: "Something went wrong while reading the file!",
      });
    }
    let scriptJSON = JSON.parse(data);
    scriptJSON[chapterNo - 1][`chapter${chapterNo}`][sceneNo - 1].scenePhoto = `/img/scenes/${req.file.filename}`;

    let copyOfFile = scriptJSON;
    scriptJSON = JSON.stringify(copyOfFile);

    fs.writeFile(`./public/bookFilesScript/${req.body.sceneDetailsScriptname}`, scriptJSON, function (err) {
      if (err) {
        console.log(err);
        res.status(200).json({
          status: "fail",
          message: "Something went wrong while writing the fille!",
        });
      }
      console.log("The file was saved!");
    });
    res.status(200).json({
      status: "success",
      message: "Scene photo has been updated!",
    });
  });
});
/*

exports.updateBookContent = (req, res) => {
  // 1. Get the content from #editor.
  let contentOfScene = req.body.content + "";
  // 2. Get the scene number and chapter number.
  let sceneNo = req.body.sceneNo * 1;
  let chapterNo = req.body.chapterNo * 1;
  let sceneName = req.body.sceneName;
  let matcher = contentOfScene.match(/{.*}/g);
  if (matcher) contentOfScene = contentOfScene.replace(/{.*}/g, `{/${sceneName}}`);
  else contentOfScene = `{/${sceneName}} ${contentOfScene};`;
  contentOfScene = contentOfScene.replace(/"/g, "");
  contentOfScene = contentOfScene.split("&lt;p>&lt;/p>").join("");
  contentOfScene = contentOfScene.split('&lt;p>"&lt;/p>').join("");
  contentOfScene = contentOfScene.split("&lt;p>;&lt;/p>").join("");
  // 3. Read the content from bookScript.
  // let bookScriptArray = getBookScript(req.scriptName);
  fs.readFile(`./public/bookFilesScript/${req.body.scriptName}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        status: "fail",
        message: "Something went wrong while reading the file!",
      });
    }
    const scriptJSON = JSON.stringify(data).replace(/;/g, "").trim();
    console.log("////////////////////////");
    console.log("////////////////////////");
    console.log(scriptJSON);
    console.log("////////////////////////");
    console.log("////////////////////////");

    let chapters = scriptJSON.split("||||||||");
    let scenesInChapter = new Array();
    chapters.forEach((ch, index) => {
      if (ch == '"') return;
      let scenes = ch.split("********");
      scenesInChapter[index] = new Array();
      scenes.forEach((sc, ind) => {
        // sc = sc.split('"').join("").split(";").join("");
        if (sc == "") return;
        scenesInChapter[index].push(sc);
        console.log("Scene start");
        console.log(sc);
        console.log("Scene End");
      });
    });
    console.log("Read Array");
    console.log(scenesInChapter);
    let bookScriptArray = scenesInChapter;
    // 5. If the content of #editor is the first scene then add 'CHAPTER NO'
    // if (sceneNo == 1) {
    //   contentOfScene = `CHAPTER ${chapterNo} \n ${contentOfScene}`;
    // }
    // 6. Assign the content of #editor into splited array.
    console.log(chapterNo);
    console.log(sceneNo);
    // If there is space for this chapter
    if (bookScriptArray[chapterNo - 1]) {
      bookScriptArray[chapterNo - 1][sceneNo - 1] = contentOfScene;
    } else {
      // If there is no space for this chapter
      bookScriptArray[chapterNo - 1] = new Array();
      bookScriptArray[chapterNo - 1][sceneNo - 1] = contentOfScene;
    }
    // 7. Convert the array into string.
    let updateContent = "";
    console.log("----Write Array----");
    console.log(bookScriptArray);

    bookScriptArray.forEach((ch, index) => {
      ch.forEach((sc) => {
        // sc = sc.split('"').join("").split(";").join("");
        if (sc == '"' || sc == "") return;
        updateContent += sc.trim();
        updateContent += "********";
      });
      if (ch.length != 0) updateContent += "||||||||";
    });
    console.log(updateContent);
    // 8. Save the string/text in to file.
    fs.writeFile(`./public/bookFilesScript/${req.body.scriptName}`, updateContent, function (err) {
      if (err) {
        console.log(err);
        res.status(200).json({
          status: "fail",
          message: "Something went wrong while writing the fille!",
        });
      }
      console.log("The file was saved!");
    });
    res.status(200).json({
      status: "success",
      message: "Book has been saved successfully!",
    });
  });
};



*/
