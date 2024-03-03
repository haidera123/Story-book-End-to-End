const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 1000);
};

const saveAndUpdateScript = (
  editorContent,
  sceneNo,
  chapterNo,
  bookId,
  scriptName,
  sceneName,
  isShowAlert,
  sceneNote,
  isShift
) => {
  const url = `http://127.0.0.1:3000/api/v1/writingtool/saveScript/${bookId}`;
  showLoadingScreen();
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      content: editorContent,
      sceneNo,
      chapterNo,
      scriptName,
      sceneName,
      sceneNote,
      isShift,
    }),
  };
  fetch(url, options).then((response) => {
    hideLoadingScreen();
    response.json().then((res) => {
      if (res.status === "success") {
        if (isShowAlert) showAlert("success", res.message);
      } else {
        showAlert("error", res.message);
      }
    });
  });
};
function saveSceneJs(isShowAlert) {
  let sceneNoEle = document.getElementById("active__sceneno");
  let chapterNoEle = document.getElementById("active__chapterno");

  if (!(sceneNoEle && chapterNoEle)) {
    ed.setData("");
    return;
  }
  let editorContent = document.getElementById("editor").innerHTML;
  let sceneNo = document.getElementById("active__sceneno").dataset.sceneNo;
  let chapterNo = document.getElementById("active__chapterno").dataset.chapterNo;
  let sceneName = document.getElementById("active__sceneno").innerText.trim();
  let bookId = document.getElementById("saveSceneBtn").dataset.bookId;
  let scriptName = document.getElementById("saveSceneBtn").dataset.scriptName;
  let sceneNote = document.getElementById("sceneNote").value.trim();
  let isNew = document.getElementById("active__sceneno").parentElement.id;
  let isShift = isNew == "new__scene" ? true : false;
  console.log(isShift);

  saveAndUpdateScript(
    editorContent,
    sceneNo,
    chapterNo,
    bookId,
    scriptName,
    sceneName,
    isShowAlert,
    sceneNote,
    isShift
  );
  document.getElementById("active__sceneno").parentElement.id = "";
}
const saveSceneBtn = document.getElementById("saveSceneBtn");
const deleteSceneBtn = document.getElementById("deleteSceneBtn");
if (saveSceneBtn) {
  saveSceneBtn.addEventListener("click", () => {
    saveSceneJs(true);
  });
}
if (deleteSceneBtn) {
  deleteSceneBtn.addEventListener("click", () => {
    let yes = confirm("Are you sure to delete this scene");
    deleteSceneJs();
  });
}
function showLoadingScreen() {
  document.querySelectorAll("#loadScreen").forEach((el) => {
    el.style.display = "block";
  });
}
function hideLoadingScreen() {
  document.querySelectorAll("#loadScreen").forEach((el) => {
    el.style.display = "none";
  });
}

const saveAndDeleteScene = (sceneNo, chapterNo, bookId, scriptName) => {
  console.log("Deleting");
  const url = `http://127.0.0.1:3000/api/v1/writingtool/deleteScene/${bookId}`;
  showLoadingScreen();
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      sceneNo,
      chapterNo,
      scriptName,
    }),
  };
  fetch(url, options).then((response) => {
    hideLoadingScreen();
    response.json().then((res) => {
      if (res.status === "success") {
        deleteSceneUI();
        showAlert("success", res.message);
      } else {
        showAlert("error", res.message);
      }
    });
  });
};

const deleteBookBtn = document.querySelectorAll(".book__manipulation--delete");
if (deleteBookBtn) {
  deleteBookBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      let yes = confirm("Are you sure to delete this book");
      console.log(yes);
      if (yes) deleteBook(btn.id);
    });
  });
}
const deleteBook = (id) => {
  console.log("Deleting");
  const url = `http://127.0.0.1:3000/api/v1/books/${id}`;
  showLoadingScreen();
  const options = {
    method: "DELETE",
  };
  fetch(url, options).then((response) => {
    showAlert("success", "This book has been deleted");
    console.log(response);
    location.assign("http://127.0.0.1:3000/createbook");
  });
};
function orderListNumber() {
  let id = [];
  let chNo = [];
  let scNo = [];
  let ul = document.querySelectorAll(".chapter__navigation");
  ul.forEach((ch, chInd) => {
    chNo.push(chInd + 1);
    let li = [...ch.getElementsByTagName("li")];
    li = li.splice(1, li.length);
    li.forEach((sc, scInd) => {
      id.push(`${chInd}-${scInd}`);
      scNo.push(scInd + 1);
    });
  });
  let textContentAssignId = document.querySelectorAll(".textContentAssignId");
  let sceneNoteAssignId = document.querySelectorAll(".sceneNoteAssignId");
  let scenePhotoAssignId = document.querySelectorAll(".scenePhotoAssignId");
  let chapter__number = document.querySelectorAll(".chapter__number--text");
  let scene__number = document.querySelectorAll(".scene__name--text");
  id.forEach((idId, ind) => {
    textContentAssignId[ind].id = `textContent-${idId}`;
    sceneNoteAssignId[ind].id = `sceneNoteContent-${idId}`;
    scenePhotoAssignId[ind].id = `scenePhoto-${idId}`;
  });
  chNo.forEach((id, ind) => {
    chapter__number[ind].dataset.chapterNo = id;
  });
  scNo.forEach((id, ind) => {
    scene__number[ind].dataset.sceneNo = id;
  });
  console.log(id);
}

function deleteSceneJs() {
  let sceneNo = document.getElementById("active__sceneno").dataset.sceneNo;
  let chapterNo = document.getElementById("active__chapterno").dataset.chapterNo;
  let bookId = document.getElementById("saveSceneBtn").dataset.bookId;
  let scriptName = document.getElementById("saveSceneBtn").dataset.scriptName;
  saveAndDeleteScene(sceneNo, chapterNo, bookId, scriptName);
  orderListNumber();
}
const deleteSceneUI = () => {
  let sceneNo = document.getElementById("active__sceneno").dataset.sceneNo - 1;
  let listLength = document.querySelector("#active__chapter");
  console.log(listLength.childNodes);
  let list_item = document.querySelector(".scene__active").remove();
  orderListNumber();
};
