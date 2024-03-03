import axios from "axios";
import { showAlert, addPostToUI } from "./alert";

export const createNewPost = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/posts/createPost",
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "New post has been created");
      addPostToUI(res.data);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    console.log(err.response.data.error.errors);
    showAlert("error", err.response.data.error.errors.content.message);
  }
};

export const likeThePost = async (postId) => {
  console.log("post");
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/api/v1/posts/likepost/${postId}`,
      data: {},
    });
    if (res.data.status === "success") {
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    console.log(err.response.data.error.errors);
    showAlert("error", err.response.data.error.errors.content.message);
  }
};

export const makeNewConnection = async (userId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/api/v1/users/makeNewConnection/${userId}`,
      data: {},
    });
    if (res.data.status === "success") {
      showAlert("success", "Connection has been established");
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    console.log(err.response.data.error.errors);
    showAlert("error", err.response.data.error.errors.content.message);
  }
};
