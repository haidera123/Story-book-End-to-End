import axios from "axios";
import { showAlert, addNewMessage } from "./alert";

export const sendNewMessage = async (msg, receiverId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/messages/${receiverId}`,
      data: {
        text: msg,
      },
    });
    if (res.data.status === "success") {
      console.log("//////////////////////");
      console.log(res.data.data.message);
      console.log("//////////////////////");

      showAlert("success", "Message sent!");
      addNewMessage(res.data.data.message);
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    console.log(err.response);

    showAlert("error", err.response);
  }
};
