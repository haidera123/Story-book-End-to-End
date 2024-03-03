import "@babel/polyfill";
import { fs } from "fs";
// import { logout } from "../../controllers/authController";
import { login, logout, signup, registerThePublisher } from "./login";
import { displayUserMenu } from "./writingui";
import { createNewBook, updateScenePhoto } from "./writingtool";
import { searchCharacterByName, searchAutoSuggestions, createNewCharacter } from "./character";
import { updateMe, updateMyPassword } from "./userSettings";
import { createNewPost, likeThePost, makeNewConnection } from "./post";
import { sendNewMessage } from "./message";
import { getAllPublishers, publishTheBook } from "./publishers";

// DOM ELEMENTS

const logInForm = document.getElementById("form");
const signUpForm = document.getElementById("signUpForm");
const logoutBtn = document.getElementById("logOutBtn");
const writingToolOptionButton = document.getElementById("writingToolOptionButton");
const createBookForm = document.getElementById("createBookForm");
const searchCharacter = document.getElementById("searchCharacter");
const characterSearchFieldForAutoSuggestions = document.getElementById("seachedCharacterName");
const addnewCharacterForm = document.getElementById("addnewCharacterForm");
const updateuser__form = document.getElementById("updateuser__form");
const changePasswordForm = document.getElementById("changePasswordForm");
const form__post = document.getElementById("form__post");
const postLike = document.querySelectorAll("#postLike");
const connectButton = document.getElementById("connectButton");
const messageForm = document.getElementById("messageForm");
const publisherForm = document.getElementById("publisherForm");
const sendBookBtn = document.querySelectorAll("#sendBookBtn");
const publishBookBtn = document.querySelectorAll("#publishBookBtn");
// DELEGATION
if (logInForm) {
  logInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (logoutBtn) logoutBtn.addEventListener("click", logout);
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const uname = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const role = document.getElementById("role").value;

    signup(fname, lname, uname, email, password, passwordConfirm, role);
  });
}

if (writingToolOptionButton) {
  writingToolOptionButton.addEventListener("click", displayUserMenu);
}
if (createBookForm) {
  createBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameOfBook = document.getElementById("nameOfBook").value;
    const language = document.getElementById("language").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const coverImg = document.getElementById("coverImg").value;
    createNewBook(nameOfBook, language, description, coverImg, category);
  });
}
if (searchCharacter) {
  searchCharacter.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Searching");

    const searchName = document.getElementById("seachedCharacterName").value;
    let bookId = document.getElementById("bookId").value;

    searchCharacterByName(searchName, bookId);
  });
}
if (characterSearchFieldForAutoSuggestions) {
  characterSearchFieldForAutoSuggestions.addEventListener("keyup", (e) => {
    let searchCharacterBtn = document.querySelector(".search__character--btn");
    searchCharacterBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
    let searchName = document.getElementById("seachedCharacterName").value.trim();
    let bookId = document.getElementById("bookId").value;

    if (searchName == "") searchName = "%20%20";
    searchAutoSuggestions(searchName, bookId);
  });
}
if (addnewCharacterForm) {
  addnewCharacterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("category", document.getElementById("category").value);
    form.append("description", document.getElementById("description").value);
    form.append("role", document.getElementById("role").value);
    form.append("photo", document.getElementById("photo").files[0]);
    form.append("bookId", document.getElementById("bookId").value);
    console.log(form);
    let bookId = document.getElementById("bookId").value;
    createNewCharacter(form, bookId);
  });
}
const updateSceneImage = document.getElementById("updateSceneImage");
if (updateSceneImage) {
  updateSceneImage.addEventListener("submit", (e) => {
    e.preventDefault();
    let sceneNo = document.getElementById("active__sceneno").dataset.sceneNo;
    let chapterNo = document.getElementById("active__chapterno").dataset.chapterNo;
    let scriptName = document.getElementById("saveSceneBtn").dataset.scriptName;
    let bookId = document.getElementById("bookId").value;

    document.getElementById("sceneDetailsSceneno").value = sceneNo;
    document.getElementById("sceneDetailsChapterno").value = chapterNo;
    document.getElementById("sceneDetailsScriptname").value = scriptName;
    const form = new FormData();
    form.append("sceneDetailsSceneno", document.getElementById("sceneDetailsSceneno").value);
    form.append("sceneDetailsChapterno", document.getElementById("sceneDetailsChapterno").value);
    form.append("sceneDetailsScriptname", document.getElementById("sceneDetailsScriptname").value);
    form.append("scenePhoto", document.getElementById("scenePhoto").files[0]);
    console.log("//////////////////");
    console.log(document.getElementById("scenePhoto").files[0]);
    console.log("//////////////////");

    updateScenePhoto(form, bookId);
  });
}

if (updateuser__form) {
  updateuser__form.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("img", document.getElementById("img").files[0]);
    form.append("fname", document.getElementById("fname").value);
    form.append("lname", document.getElementById("lname").value);
    form.append("email", document.getElementById("email").value);
    form.append("about", document.getElementById("about").value);
    const userId = document.getElementById("userId").value;
    updateMe(form, userId);
  });
}

if (changePasswordForm) {
  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let passwordCurrent = document.getElementById("passwordCurrent").value;
    let password = document.getElementById("password").value;
    let passwordConfirm = document.getElementById("passwordConfirm").value;
    updateMyPassword(passwordCurrent, password, passwordConfirm);
  });
}

if (form__post) {
  form__post.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("content", document.getElementById("content").value);
    form.append("photo", document.getElementById("photo").files[0]);
    createNewPost(form);
  });
}

if (postLike) {
  postLike.forEach((ps) => {
    ps.addEventListener("click", (e) => {
      let postId = e.target.dataset.postId;
      let likeNumber = e.target.parentNode.childNodes[3].innerText * 1;
      e.target.parentNode.childNodes[3].innerText = likeNumber + 1;
      e.target.classList.toggle("likePost");
      if (e.target.classList.contains("likePost")) {
        e.target.parentNode.childNodes[3].innerText = likeNumber + 1;
      } else {
        e.target.parentNode.childNodes[3].innerText = likeNumber - 1;
      }
      likeThePost(postId);
    });
  });
}

if (connectButton) {
  connectButton.addEventListener("click", (e) => {
    e.preventDefault();
    connectButton.value = "Connected";
    connectButton.disabled = true;
    let userId = document.getElementById("connectButton").dataset.userId;
    makeNewConnection(userId);
  });
}
if (messageForm) {
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let text = document.getElementById("text").value.trim();
    let receiverId = document.getElementById("receiverId").value.trim();
    sendNewMessage(text, receiverId);
  });
}

if (publisherForm) {
  publisherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("subtitle", document.getElementById("subtitle").value);
    form.append("about", document.getElementById("about").value);
    form.append("email", document.getElementById("email").value);
    form.append("phone", document.getElementById("phone").value);
    form.append("address", document.getElementById("address").value);
    form.append("country", document.getElementById("country").value);
    form.append("img", document.getElementById("img").files[0]);
    console.log(form);
    registerThePublisher(form);
  });
}
if (sendBookBtn) {
  sendBookBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bookId = e.target.dataset.bookId;
      getAllPublishers(bookId);
    });
  });
}
if (publishBookBtn) {
  console.log("click");
  console.log(publishBookBtn);
  publishBookBtn.forEach((btn) => {
    console.log("click");
    btn.addEventListener("click", (e) => {
      console.log("click");
      const bookId = e.target.dataset.bookId;
      publishTheBook(bookId);
    });
  });
}
