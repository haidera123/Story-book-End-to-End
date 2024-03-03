const fs = require("fs");
const express = require("express");
const app = express();

// fs.writeFile("./test.txt", "Hey there!", function (err) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log("The file was saved!");
// });
let file = fs.readFileSync("./test.txt", "utf-8");
file = JSON.stringify(file);
let chapters = file.split("////////");
let chapterInScenes = new Array(new Array());
chapters.forEach((ch, index) => {
  let scenes = ch.split("********");
  chapterInScenes[index] = new Array(scenes.length);
  scenes.forEach((sc, ind) => {
    chapterInScenes[index].push(sc.trim());
  });
});
console.log(chapterInScenes);
// let chapterInScenes = chapters.s;
console.log(JSON.stringify(chapters.length));
// app.listen(5000, () => {
//   console.log("server started");
// });
