import axios from "axios";
import { showAlert, addAllPublishersToList,addEventListenersToSendRequestBtn } from "./alert";

export const getAllPublishers = async (bookId) => {
  console.log("tes");
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/getAllPublishers",
    });
    if (res.data.status === "success") {
    //   showAlert("success", "Logged in successfully!");
    console.log('bookId')
    console.log(bookId)
    addAllPublishersToList(res.data,bookId);
    addEventListenersToSendRequestBtn();
     
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response);
    console.log(err.response);
  }
};

export const sendBookRequests =async (publisherId, bookId) =>{
  console.log("alsdlaldkasjkldjlasjkldklajd");
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:3000/api/v1/users/sendBookRequest",
      data:{
        publisherId,
        bookId
      }
    });
    if (res.data.status === "success") {
      showAlert("success", "Your request has been processed!");
      location.assign("/createBook");
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response);
    console.log(err.response);
  } 
}

export const publishTheBook = async (bookId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/api/v1/users//publishTheBook/${bookId}`,
      data:{}
    });
    if (res.data.status === "success") {
      showAlert("success", "Congratualations book has been published!");
      // location.assign("/createBook");
    } else {
      showAlert("error", "Something went wrong!");
    }
  } catch (err) {
    showAlert("error", err.response);
    console.log(err.response);
  } 
}