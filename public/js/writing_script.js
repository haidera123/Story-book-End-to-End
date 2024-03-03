let ed = 0;
DecoupledEditor.create(document.querySelector("#editor"), {
  // resize_enabled: false,
  removePlugins: [
    "fontBackgroundColor",
    "Link",
    "code",
    "codeBlock",
    "todoList",
    "strikethrough",
    "subscript",
    "superscript",
    "outdent",
  ],
  toolbar: [
    "heading",
    "|",
    "fontfamily",
    "fontsize",
    "|",
    "fontColor",
    "|",
    "bold",
    "italic",
    "|",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "|",
    "imageUpload",
    "blockQuote",
    "|",
    "undo",
    "redo",
  ],
  // plugins: [ WordCount]
  // plugins: ["autogrow"],
  // autoGrow_onStartup: true,
  // resize_enabled: true,
  // removePlugins: "elementspath",
})
  .then((editor) => {
    ed = editor;
    const toolbarContainer = document.querySelector("#toolbar-container");
    toolbarContainer.appendChild(editor.ui.view.toolbar.element);
    // editor.setData(`CHAPTER 1
    // <h2>Main Story:</h2>&lt;p>In 1995 there was one German army officer. He said that he will be dead but not will leave the country.&lt;/p>`);
    // editor.setData(editor.getData())

    // editor.resize_enabled = "false";
    // editor.isReadOnly = true;
    console.log(editor.config);
  })
  .catch((error) => {
    console.error(error);
  });
// DecoupledEditor.config.fullPage = false;
// DecoupledEditor.config.resize_enabled = false;
// DecoupledEditor.config.removePlugins = "resize,autogrow";
let con = document.getElementById("textContent-0-0").value.replaceAll("&lt;", "<");
let matcher = con.match(/{.*}/g);
if (matcher) con = con.replace(/{.*}/g, ``);
document.getElementById("editor").innerHTML = con;
const note = document.getElementById("sceneNoteContent-0-0").value;
document.getElementById("sceneNote").value = note.trim();
const photo = document.getElementById(`scenePhoto-0-0`);
const imagePreview = document.getElementById("imagePreview");
if (photo) {
  imagePreview.style.backgroundImage = photo.value;
}
function updateData() {
  let sceneNoEle = document.getElementById("active__sceneno");
  let chapterNoEle = document.getElementById("active__chapterno");
  let sceneNo = 0;
  let chapterNo = 0;
  if (sceneNoEle && chapterNoEle) {
    sceneNo = sceneNoEle.dataset.sceneNo - 1;
    chapterNo = chapterNoEle.dataset.chapterNo - 1;
    let contentEle = document.getElementById(`textContent-${chapterNo}-${sceneNo}`);
    if (contentEle) {
      contentEle.value = ed.getData();
    }
    const note = document.getElementById(`sceneNoteContent-${chapterNo}-${sceneNo}`);
    if (note) {
      note.value = document.getElementById("sceneNote").value.trim();
    }
    const photo = document.getElementById(`scenePhoto-${chapterNo}-${sceneNo}`);
    const imagePreview = document.getElementById("imagePreview");
    if (photo) {
      photo.value = imagePreview.style.backgroundImage;
    }
  }
}
function getContent() {
  let sceneNoEle = document.getElementById("active__sceneno");
  let chapterNoEle = document.getElementById("active__chapterno");

  if (!(sceneNoEle && chapterNoEle)) {
    ed.setData("");
    return;
  }

  let sceneNo = document.getElementById("active__sceneno").dataset.sceneNo - 1;
  let chapterNo = document.getElementById("active__chapterno").dataset.chapterNo - 1;
  let contentEle = document.getElementById(`textContent-${chapterNo}-${sceneNo}`);
  const note = document.getElementById(`sceneNoteContent-${chapterNo}-${sceneNo}`);
  if (note) {
    document.getElementById("sceneNote").value = note.value.trim();
  }
  const photo = document.getElementById(`scenePhoto-${chapterNo}-${sceneNo}`);
  const imagePreview = document.getElementById("imagePreview");
  if (photo) {
    imagePreview.style.backgroundImage = photo.value;
  }
  if (contentEle) {
    let con = contentEle.value.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
    let matcher = con.match(/{.*}/g);
    if (matcher) con = con.replace(/{.*}/g, ``);
    ed.setData(`${con}`);
  } else {
    ed.setData("");
  }
}
