// Type is either success or error
import { sendBookRequests } from "./publishers"

export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};
export const updateSearchFilter = (body) => {
  const searchCharacter = document.getElementById("searchCharacter");

  let search__filter = document.querySelector(".search__filter--ul");
  search__filter.innerHTML = "";

  if (body) {
    let searchArray = body.data.characters;
    console.log(searchArray);
    searchArray.forEach((chName) => {
      let li = document.createElement("LI");
      li.innerHTML = chName.name;
      li.classList.add("search__filter--li");
      li.addEventListener("click", function () {
        updateInputSearch(this);
      });
      search__filter.appendChild(li);
    });
    let searchCharacterBtn = document.querySelector(".search__character--btn");
    searchCharacterBtn.innerHTML = `<i class="fas fa-search"></i>`;
  }
};
export const updateSearchUI = (body) => {
  if (body) {
    console.log(body);

    let characterInfo = body.data.character;
    document.getElementById("nameSearch").value = characterInfo.name;
    document.getElementById("categorySearch").value = characterInfo.category;
    document.getElementById("descriptionSearch").value = characterInfo.description;
    document.getElementById("roleSearch").value = characterInfo.role;
    document.getElementById("photoSearch").src = `/img/characters/${body.data.character.photo}`;
  } else {
    document.getElementById("nameSearch").value = "";
    document.getElementById("categorySearch").value = "";
    document.getElementById("descriptionSearch").value = "";
    document.getElementById("roleSearch").value = "";
    document.getElementById("photoSearch").src = `/img/characters/pngwing.png`;
  }
};

export const addPostToUI = (body) => {
  console.log(body);
};

export const addNewMessage = (msg) => {
  const message__list = document.querySelector(".message__list--ul");
  const li = document.createElement("LI");
  li.innerHTML = `<div class="message__list--box">
  <div class="message__list--profile">
    <img src="/img/users/profileplaceholder.png" alt="profile Pic" />
  </div>
  <div class="message__list--details">
    <div class="message__list--timeuname">
      <span class="message__list--uname"> UserName </span>
      <span class="message__list--time"> ${msg.time}</span>
    </div>
    <div class="message__list--msg">
      <p>${msg.text}</p>
    </div>
  </div>
</div>`;
  li.classList.add("message__list--li");
  message__list.appendChild(li);
  console.log(message__list);
};

export const addAllPublishersToList = (data,bookId)=>{
  console.log(data);
  const publisherContainer = document.getElementById("publisherContainer");
  publisherContainer.style.display = "block";
  const parent = document.getElementById("parent");
  parent.innerHTML="";
  data.data.forEach((pub,ind)=>{
    const div = document.createElement("div");
    const html = ` <div class="container__popup--publisher">
    <div class="publisher__box">
      <div class="primary__publisher--info">
      <img src="/img/users/${pub.img}" alt="sd img">
      <div class="publisher__info--popup">
        <h2>${pub.name}</h2>
        <h4>${pub.subtitle}</h4>
      </div>
    </div>
    <div class="secondary__publisher--info">
    <button id='sendBookRequest' data-book-id="${bookId}" data-publisher-id="${pub._id}">
  
    </button>
      </div>
    </div>
  </div>  `;
  //  const text = pub.bookSend[0]==bookId.toString()?"Remove" : "Send";

   
  div.innerHTML = html;
  parent.appendChild(div);
  let isSend = false;
  for(let x=0;x<pub.bookSend.length;x++){
    if(pub.bookSend[x]._id.toString()==bookId.toString()){
      isSend=true;
    }
  }
  if(isSend){
    document.querySelectorAll('#sendBookRequest')[ind].innerHTML="Pull Out";
  }else{
    document.querySelectorAll('#sendBookRequest')[ind].innerHTML="Send";  
  }
  
  // pub.bookSend.forEach(bk=>{
  //       console.log('sdsdsdsdsdsdsdsdsdsdsddd'+bk._id);
    
  //   if(bk._id.toString()==bookId.toString()){
  //     document.querySelectorAll('#sendBookRequest')[ind].innerHTML="Pull Out";
  //   }else{
  //     document.querySelectorAll('#sendBookRequest')[ind].innerHTML="Send"
  //   }
  // })
  });
  
  
  console.log(data);
}

export const addEventListenersToSendRequestBtn = ()=>{
  const [...sendBookRequestBtn] = document.querySelectorAll('#sendBookRequest');
  console.log(sendBookRequestBtn);

  sendBookRequestBtn.forEach(btn=>{
    console.log(btn);
    btn.addEventListener('click',(e)=>{
     const bookId = e.target.dataset.bookId;
     const publisherId= e.target.dataset.publisherId;
     sendBookRequests(publisherId, bookId);
     console.log(e.target.innerText)
     e.target.innerText = e.target.innerText == 'Pull Out'?'Send':'Pull Out';
     console.log(bookId,publisherId);
    });
  });
}