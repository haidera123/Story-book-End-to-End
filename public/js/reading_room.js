DecoupledEditor.create(document.querySelector("#editor"), {
  readOnly: true,
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
    "indent",
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
})
  .then((editor) => {
    editor.isReadOnly = true;
  })
  .catch((error) => {
    console.error(error);
  });
