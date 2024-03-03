import axios from "axios";
import { showAlert } from "./alert";

export const updateMe = async (data, userId) => {
  console.log("tes");
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/api/v1/users/settings/${userId}`,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Your account settings has been updated");
      location.assign(`http://127.0.0.1:3000/settings/${userId}`);
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err);
  }
};

export const updateMyPassword = async (passwordCurrent, password, passwordConfirm) => {
  console.log("tes");
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/api/v1/users/updateMyPassword`,
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Your password has been changed");
      window.setTimeout(() => {
        location.assign("http://127.0.0.1:3000");
      }, 1500);
    } else {
      showAlert("error", "Something went wrong!");
      console.log(res);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response);
  }
};
