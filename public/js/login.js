import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  console.log("tes");
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response);
  }
};
export const registerThePublisher = async (data) => {
  console.log("tes");
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/registerPublisher",
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Publisher has been registered");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message.message);
    console.log(err.response);
  }
};

export const logout = () => {
  const url = "http://127.0.0.1:3000/api/v1/users/logout";
  const options = {
    method: "GET",
  };
  fetch(url, options).then((response) => {
    response.json().then((res) => {
      console.log(res);
      if (res.status === "success") {
        location.reload(true);
        showAlert("success", "Logged out successfully!");
      } else {
        showAlert("error", "No internet connection");
      }
      console.log(res);
    });
  });
};
export const signup = async (fname, lname, uname, email, password, passwordConfirm, role) => {
  if (password != passwordConfirm) {
    showAlert("error", "Password does not match");
    return;
  }
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/signup",
      data: {
        fname,
        lname,
        uname,
        email,
        password,
        passwordConfirm,
        role,
      },
    });
    if (res.data.status === "success") {
      if (res.data.status === "success") {
        showAlert("success", "Your account has been created successfully!");

        window.setTimeout(() => {
          location.assign("/");
        }, 1500);
      } else {
        console.log(res.data);
        console.log(res)
        showAlert("error", "Something went wrong!");
      }
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message.message);
  }
  // const url = "http://127.0.0.1:3000/api/v1/users/signup";
  // const options = {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json;charset=UTF-8",
  //   },
  //   body: JSON.stringify({
  //     fname,
  //     lname,
  //     uname,
  //     email,
  //     password,
  //     passwordConfirm,
  //     role,
  //   }),
  // };
  // fetch(url, options).then((response) => {
  //   response
  //     .json()
  //     .then((res) => {
  //       console.log("yes");
  //       console.log(res);
  //       if (res.status === "success") {
  //         showAlert("success", "Your account has been created successfully!");

  //         window.setTimeout(() => {
  //           location.assign("/");
  //         }, 1500);
  //       } else {
  //         showAlert("error", JSON.parse(res.message.name));
  //       }
  //       showAlert("error", JSON.parse(res.message.name));

  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log("/////");
  //       showAlert("error", JSON.parse(err.response.message.name));

  //       console.log(err.response);
  //     });
  // });
};
