import axios from "axios";
import { showAlert, updateSearchUI, updateSearchFilter } from "./alert";

export const searchCharacterByName = async (name, bookId) => {
  console.log("tes");
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/characters/searchByName/${name}/${bookId}`,
      data: {},
    });
    console.log("////////////////////////////");
    console.log(res);
    console.log("////////////////////////////");

    if (res.data.status === "success") {
      console.log(res.data.data.character);

      if (res.data.data.character != undefined) {
        console.log("yes");
        updateSearchUI(res.data);
      } else {
        console.log("yes");
        updateSearchUI(false);
        showAlert("error", "There is no character with this name");
      }
    } else {
      showAlert("error", "Something went wrong!");
      console.log(res);
    }
  } catch (err) {
    showAlert("error", err.response);
  }
};

export const searchAutoSuggestions = async (l, bookId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/characters/characterSuggestions/${l}/${bookId}`,
      data: {},
    });
    if (res.data.status === "success") {
      updateSearchFilter(res.data);
    } else {
      showAlert("error", "Something went wrong!");
      updateSearchFilter(false);
    }
  } catch (err) {
    updateSearchFilter(false);
    showAlert("error", err.response);
  }
};

export const createNewCharacter = async (data, bookId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/characters/${bookId}`,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "New character is added to this book");
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response);
    console.log(err.response.data);
  }
};
