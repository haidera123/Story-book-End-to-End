import { showAlert } from "./alert";
import axios from "axios";

export const createNewBook = (nameOfBook, language, description, coverImg, category) => {
  const url = "http://127.0.0.1:3000/api/v1/books";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      name: nameOfBook,
      language,
      description,
      coverImg,
      category,
    }),
  };
  fetch(url, options).then((response) => {
    response.json().then((res) => {
      if (res.status === "success") {
        showAlert("success", "Your book has been created");
      } else {
        showAlert("success", "Your book has been created");
      }
      location.assign("/createbook");
      console.log(res);
    });
  });
};
export const updateScenePhoto = async (data, bookId) => {
  console.log(bookId)
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/writingtool/updateScenePhoto/${bookId}`,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Scene photo has been updated");
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response);
    console.log(err);
  }
};