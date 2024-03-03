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

const closeStoryStructure = () => {
  const element = document.querySelector(".writing__tool--storyStructure");
  element.classList.toggle("display__none");
};

const openNavigation = () => {
  const element = document.querySelector(".writing__topmenuRes");
  const backgroudlayer = document.querySelector(".box");
  element.classList.toggle("display__none");
  backgroudlayer.classList.toggle("display__none");
};
const displayMenu = (ele) => {
  let menu1 = document.querySelectorAll(".scene__option--menu");
  let checkBox1 = document.querySelectorAll(".scene__checkbox");
  let list_item1 = document.querySelectorAll(".chapter__navigation--item");
  menu1.forEach((el) => {
    el.classList.remove("display_block");
  });
  list_item1.forEach((el) => {
    el.classList.remove("active");
  });
  checkBox1.forEach((el) => {
    el.classList.remove("checked");
  });
  let menu = ele.parentNode.childNodes[3];
  let list_item = ele.parentNode.parentNode.parentNode.parentNode;
  console.log(menu);
  let checkBox = ele.parentNode.parentNode.parentNode.childNodes[1];

  list_item.classList.toggle("active");
  menu.classList.toggle("display_block");
  checkBox.classList.toggle("checked");
};
const selectScene = (ele, reading = false) => {
  // Diselect all selected scenes
  let selectedSceneBox;
  if (reading) {
    selectedSceneBox = document.querySelectorAll(".scene__active--reading");
  } else {
    selectedSceneBox = document.querySelectorAll(".scene__active");
  }
  let selectedCheckBoxScene = document.querySelectorAll(".scene__checkbox--active");
  console.log(selectedSceneBox);
  if (reading) {
    selectedSceneBox.forEach((el) => {
      el.classList.remove("scene__active--reading");
    });
  } else {
    selectedSceneBox.forEach((el) => {
      el.classList.remove("scene__active");
    });
  }
  document.querySelectorAll("#active__chapter").forEach((el) => {
    el.id = "";
  });
  selectedCheckBoxScene.forEach((el) => {
    el.classList.remove("scene__checkbox--active");
  });
  let sceneEleMy = ele.childNodes[3].childNodes[1];
  let chapterEleMy =
    ele.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1].childNodes[1];

  let list_item = ele.parentNode;
  list_item.parentNode.id = "active__chapter";
  console.log(list_item.parentNode);

  // Select the cliked scenes
  document.querySelectorAll("#active__sceneno").forEach((el) => {
    el.id = "";
  });
  document.querySelectorAll("#active__chapterno").forEach((el) => {
    el.id = "";
  });

  sceneEleMy.id = "active__sceneno";
  chapterEleMy.id = "active__chapterno";

  console.log(list_item.nextElementSibling);
  let checkBox = ele.childNodes[1];
  if (reading) {
    list_item.classList.add("scene__active--reading");
  } else {
    list_item.classList.add("scene__active");
  }
  checkBox.classList.add("scene__checkbox--active");
};

const addSceneAfter = (e) => {
  console.log("Add scene");
  e.preventDefault();
  let sceneNo = document.getElementById("active__sceneno").dataset.sceneNo * 1;
  let chapterNo = document.getElementById("active__chapterno").dataset.chapterNo * 1;
  let sceneName = document.getElementById("sceneName").value;
  document.getElementById("sceneName").value = "";
  let list_item = document.querySelector(".scene__active");

  let newItem = document.createElement("LI");
  newItem.classList.add("chapter__navigation--item");
  newItem.innerHTML = `
                    <div class="chapter__navigation--element scene"  onclick="updateData(),selectScene(this),getContent(),saveSceneJs(false)">
                      <span class="scene__checkbox">
                        <span class="scene__checkbox--element"></span>
                        <input
                        type="hidden"
                        class="textContentAssignId"
                        id="textContent-${chapterNo - 1}-${sceneNo}"
                        value=" "
                      />
                      <input
                      type="hidden"
                      id="sceneNoteContent-${chapterNo - 1}-${sceneNo}"
                      class="sceneNoteAssignId"
                      value=""
                    />
                    <input
                    type="hidden"
                    id="scenePhoto-${chapterNo - 1}-${sceneNo}"
                    value="url('/img/scenes/default.png')"
                    class="scenePhotoAssignId"
                  />
                      </span>
                      <div class="scene__name" id="new__scene">
                        <span class="scene__name--text"                 contenteditable="true"
                        data-scene-no="${sceneNo + 1}">${
    sceneName 
  }</span>          <i
  class="fa fa-plus"
  style="font-size: 15px; margin-right: 12px"
  aria-hidden="true"
  onclick="scenePopUp()"
></i>

                      </div>
                    </div>
                  `;

  let list =
    document.querySelector("#active__chapterno").parentNode.parentNode.parentNode.parentNode;
  console.log(list_item);
  try {
    list.insertBefore(newItem, list_item.nextElementSibling);
  } catch {
    list.appendChild(newItem);
  }
  document.querySelector(".popup__background").classList.toggle("display__block");
  orderListNumber();
};

function removeSaveFromActive() {
  document.getElementById();
}
const addChapter = () => {
  let chaptersList = document.querySelectorAll(".chapter__number--text");
  let lastChapterId = chaptersList[chaptersList.length - 1].dataset.chapterNo * 1;
  console.log(lastChapterId);
  const html = `
  <li class="chapter__navigation--item">
    <div class="chapter__navigation--element chapter">
      <span class="chapter__number">
        <span
          class="chapter__number--text"
          data-chapter-no="${lastChapterId + 1}"
          >${lastChapterId + 1}</span
        >
      </span>
      <div class="chapter__name">
        <span class="chapter__name--text">Chapter</span>
      </div>
    </div>
  </li>
  <input
    type="hidden"
    id="textContent-${lastChapterId}-0"
    value=""
  />
  <input
  type="hidden"
  id="sceneNoteContent-${lastChapterId}-0"
  class="sceneNoteAssignId"
  value=""
/>
<input
type="hidden"
id="scenePhoto-${lastChapterId}-0"
value="url('/img/scenes/default.png')"
class="scenePhotoAssignId"
/>

  <li class="chapter__navigation--item">
    <div class="chapter__navigation--element scene" onclick="updateData(),selectScene(this),getContent(),saveSceneJs()">
      <span class="scene__checkbox ">
        <span class="scene__checkbox--element"></span>
      </span>
      <div class="scene__name">
        <span
          class="scene__name--text"
          
          data-scene-no="1"
          contenteditable="true"
          >Scene name</span
        >
        <i
  class="fa fa-plus"
  style="font-size: 15px; margin-right: 12px"
  aria-hidden="true"
  onclick="scenePopUp()"
></i>

      </div>
    </div>
  </li>
`;
  let ulElement = document.createElement("UL");
  ulElement.classList.add("chapter__navigation");
  ulElement.innerHTML = html;
  document.getElementById("storyStructure__navigation").appendChild(ulElement);
  orderListNumber();
};

const scenePopUp = () => {
  const element = document.querySelector(".popup__background");
  element.classList.toggle("display__block");
};
const closeTab = () => {
  const element = document.querySelector(".popup__background");
  element.classList.toggle("display__block");
};
const closeCharacterSide = () => {
  const element = document.querySelector(".container__expand");
  element.classList.toggle("display__none");
  document.querySelector(".writing__tool--character").classList.toggle("width_2-5");
  document.querySelector(".writing__tool--character--expand").classList.toggle("display__block");
  console.log("clicked");
};
let dragStartIndex;
function dragStart() {
  console.log("Event", "dragstart");
  dragStartIndex = +this.closest("li").getAttribute("data-start-index");
  console.log(dragStartIndex);
}
function updateInputSearch(ele) {
  let charName = ele.innerText;
  document.getElementById("seachedCharacterName").value = charName.trim();

  let search__filter = document.querySelector(".search__filter--ul");
  search__filter.innerHTML = "";
}
function dragEnter(e) {
  let ele = e.path[3];
  if (ele.id == "draggble-list-item") ele.classList.add("over");
  console.log(e.path);
  console.log("enter");

  // console.log("Event", "dragenter");
}
function dragLeave(e) {
  // this.classList.remove("over");
  // console.log("Event", "dragLeave");
  let ele = e.path[3];
  console.log(e.path[3]);
  if (ele.id == "draggble-list-item") ele.classList.add("over");
}
function dragOver() {
  // console.log("Event", "dragOver");
}
function dragDrop(e) {
  // console.log("Event", "dragDrop");
  // const dragEndIndex = +this.closest("li").getAttribute("data-start-index");
  // console.log(dragEndIndex);
  console.log(e.path[3].getAttribute("data-start-index"));
  console.log("droped");
}
const draggableList = document.querySelectorAll("#draggable-list li");
const draggable = document.querySelectorAll(".chapter__navigation--element");

if (draggable) {
  draggable.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
  });
}

if (draggableList) {
  draggableList.forEach((item) => {
    item.addEventListener("dragover", function (e) {
      e.preventDefault();
      dragOver(e);
    });
    item.addEventListener("drop", function (e) {
      e.preventDefault();
      dragDrop(e);
    });
    item.addEventListener("dragenter", function (e) {
      e.preventDefault();
      dragEnter(e);
    });
    item.addEventListener("dragleave", function (e) {
      e.preventDefault();
      dragLeave(e);
    });
  });
}

function displayCharacterOption() {
  let menu = document.getElementById("characterOptions").value;
  if (menu == "add") {
    document.getElementById("addCharacter__box").classList.remove("display__none");
    document.getElementById("searchCharacter__box").classList.add("display__none");
    document.getElementById("sceneDetails").classList.add("display__none");

    document.getElementById("allCharacters").classList.add("display__none");
  } else if (menu == "all") {
    document.getElementById("addCharacter__box").classList.add("display__none");
    document.getElementById("searchCharacter__box").classList.add("display__none");
    document.getElementById("sceneDetails").classList.add("display__none");

    document.getElementById("allCharacters").classList.remove("display__none");
  } else if (menu == "search") {
    document.getElementById("sceneDetails").classList.add("display__none");
    document.getElementById("allCharacters").classList.add("display__none");
    document.getElementById("addCharacter__box").classList.add("display__none");

    document.getElementById("searchCharacter__box").classList.remove("display__none");
  } else if (menu == "scene") {
    document.getElementById("addCharacter__box").classList.add("display__none");
    document.getElementById("searchCharacter__box").classList.add("display__none");
    document.getElementById("allCharacters").classList.add("display__none");

    document.getElementById("sceneDetails").classList.remove("display__none");
  }
}

function updateDescription(ind) {
  let text = document.getElementById(`characterDescription-${ind}`).value;
  document.getElementById("characterDescriptionTextarea").value = text;
}
document.querySelector(".editor__reading--disabled").contentEditable = false;
