let modal = document.querySelector("[class='modal']"),
  modalshown = false,
  title = document.querySelector("[type='text']"),
  description = document.querySelector("textarea"),
  addButton = document.querySelector("[id='add_btn']"),
  notes = [],
  LOCAL_NOTES = "stored_notes",
  notesContainer = document.querySelector("[class='container']"),
  titleLength = "hello world fkafja",
  descriptionLength =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur tenetur nisi ea quasi enim magnam esse nobis? Necessitatibus dolore earum odio, illum nobis dele Lorem ipsum dolor sit amet consectetur adipisicing Lorem.",
  DateFormatter = new Intl.DateTimeFormat("en-us", {
    month: "long",
    day: "2-digit",
    year: "2-digit",
  }),
  editIndex = null,
  isEditing = false,
  AddNoteText = document.querySelector("[class='add_note_text']"),
  contentModal = document.querySelector("[class='content_modal']"),
  notesDates = contentModal.querySelector("[class='note_dates']"),
  notesText = contentModal.querySelector("[class='notes_text']"),
  notesDescription = contentModal.querySelector("[class='note_description']"),
  contentModalCross = contentModal.querySelector(
    "[class='close_content_modal']"
  ),
  recoverButton = document.querySelector("[class='recover_btn']"),
  recoverModal = document.querySelector("[class='recover_notes_container']"),
  recoverNotesTitleLength = "Hello world ia m the best",
  RECOVERED_NOTES = [],
  RECOVER_NOTES_KEY = "store_recover_notes",
  recover_notes_input = document.querySelector(
    "[placeholder='Search Your notes']"
  ),
  recover_items_container = document.querySelector(
    "[id='recover_items_container']"
  ),
  single_recover_item = recover_items_container.getElementsByClassName(
    "single_recover_note"
  ),
  searchModal = document.querySelector("[id='search_notes_dialog']"),
  filter_notes = searchModal.querySelector("[class='filter_notes']");
  filter_input = searchModal.querySelector("[id='filter_notes_input']"),

recoverButton.onclick = () => showDialog(recoverModal, true);

closeONOutsideClick(recoverModal);
closeONOutsideClick(searchModal);

const handleShowSideMenu = (element, important) => {
  let Sidebar = element.parentElement.parentElement.firstElementChild;
  Sidebar.classList.toggle("left");

  if (Sidebar.classList.contains("left")) {
    element.innerHTML = `<div class="cross">&times;</div>`;
  } else {
    element.innerHTML = `<div class="options">
    <img src="more.png" alt="Loading..." style="filter:invert(${
      important ? 1 : 0
    })">
  </div>`;
  }
};
const handleFilterNotes = (value, Filterarray, keyOfFilterELement) => {
  let Filtervalue = value;
  let ArrayToSearch = Filterarray;
  let keyOfELement = keyOfFilterELement;
  return () => {
    ArrayToSearch.forEach((note) => {
      let noteElement = document.querySelector(
        `[${keyOfELement}='${note.key}']`
      );
      if (Filtervalue == "") {
        noteElement.style.display = "";
      } else {
        if (note.title.toLowerCase().includes(Filtervalue.toLowerCase())) {
          noteElement.style.display = "";
        } else {
          noteElement.style.display = "none";
        }
      }
    });
  };
};

function debounce(fx, time) {
  let id = null;
  return () => {
    if (!id) {
      id = setTimeout(fx, time);
    } else {
      clearTimeout(id);
    }
  };
}

recover_notes_input.addEventListener("input", function () {
  let filterRecoverNotes = handleFilterNotes(
    this.value,
    RECOVERED_NOTES,
    "data-recover-key"
  );
  let debounceRecoverNotes = debounce(filterRecoverNotes, 1000);
  debounceRecoverNotes();
});

filter_input.addEventListener("input",function () {
  let filterSearchNotes = handleFilterNotes(
    this.value,
    notes,
    "data-filter-key"
  );
  let debounceRecoverNotes = debounce(filterSearchNotes, 1000);
  debounceRecoverNotes();
})

showNotes();
showRecoverNotes();
showFilterNotes()

const openModal = () => showDialog(modal, true);

const CloseModal = () => closeModal(modal);

function showDialog(element, isModal) {
  if (isModal) {
    return element.showModal();
  } else {
    return element.show();
  }
}

function closeModal(element) {
  return element.close();
}

contentModalCross.onclick = () => closeModal(contentModal);

function closeONOutsideClick(element) {
  return element.addEventListener("click", (e) => {
    const dialogDimensions = element.getBoundingClientRect();
    if (
      e.clientX > dialogDimensions.right ||
      e.clientX < dialogDimensions.left ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeModal(element);
    }
  });
}

closeONOutsideClick(contentModal);
closeONOutsideClick(modal);

function saveNotes() {
  localStorage.setItem(LOCAL_NOTES, JSON.stringify(notes));
  showNotes();
}

function saveRecoverNotes() {
  localStorage.setItem(RECOVER_NOTES_KEY, JSON.stringify(RECOVERED_NOTES));

  showRecoverNotes();
}

function handleDelete(element) {
  let key =
    element.parentElement.parentElement.parentElement.getAttribute("data-key");
  let deletedNotes = notes.filter((note) => note.key !== key);
  let recoveredNotes = notes.find((note) => note.key == key);
  RECOVERED_NOTES.push(recoveredNotes);

  saveRecoverNotes();
  localStorage.setItem(LOCAL_NOTES, JSON.stringify(deletedNotes));
  showNotes();
}

function findNote(element) {
  let Elementkey =
    element.parentElement.parentElement.parentElement.getAttribute("data-key");
  const findedNote = notes.find((note) => note.key == Elementkey);
  return findedNote;
}

function handleEdit(element) {
  addButton.textContent = "Edit note";
  AddNoteText.textContent = "Edit note";
  let Editedkey =
    element.parentElement.parentElement.parentElement.getAttribute("data-key");
  showDialog(modal, true);
  const findedNOte = notes.find((note) => note.key == Editedkey);
  const editedIndex = notes.findIndex((note) => note.key == Editedkey);
  title.value = findedNOte.title;
  description.value = findedNOte.description;
  editIndex = editedIndex;
  isEditing = true;

  saveNotes();
}

function handleImportant(element) {
  let findedNote = findNote(element);
  findedNote.important = !findedNote.important;

  saveNotes();
}

function handlePinNote(element) {
  let findedNote = findNote(element);
  findedNote.pinned = !findedNote.pinned;

  saveNotes();
}

function handleReadNote(element) {
  let findedNote = findNote(element);

  showReadedNoteContent(findedNote);
}

function handleShowSearchModal(element){
  showDialog(searchModal, true);

  let elementToToggle = element.parentElement.nextElementSibling.nextElementSibling.nextElementSibling

  ToggleIcon(elementToToggle,element.parentElement)

}

function ToggleIcon(element,parent){
  parent.classList.toggle("left");
  if (parent.classList.contains("left")) {
    element.innerHTML = `<div class="cross">&times;</div>`;
  } else {
    element.innerHTML = `<img src="more.png" alt="Loading..." class="add_note_options">`;
  }
}

function openAddNoteSideMenu(element) {
  let addNoteSideBar =
    element.previousElementSibling.previousElementSibling
      .previousElementSibling;
  ToggleIcon(element,addNoteSideBar);
}

function showNotes() {
  let local_notes = localStorage.getItem(LOCAL_NOTES);
  if (local_notes !== null) {
    notes = JSON.parse(local_notes);
  } else {
    notes = [];
  }

  notesContainer.innerHTML = "";

  let addButton = `<div class="note center" style="overflow:hidden;">
  <div class="add_note_side_menu">
  <div class="search center height font_increase" onclick="handleShowSearchModal(this)"><svg xmlns="http://www.w3.org/2000/svg" style="margin-right:15px;" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16Zm0-2q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"/></svg>Search Notes</div>
  <div class="Clear center height font_increase"><svg style="margin-right:20px;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 23v-7q0-2.075 1.463-3.538T8 11h1V3q0-.825.588-1.413T11 1h2q.825 0 1.413.588T15 3v8h1q2.075 0 3.538 1.463T21 16v7H3Zm2-2h2v-3q0-.425.288-.713T8 17q.425 0 .713.288T9 18v3h2v-3q0-.425.288-.713T12 17q.425 0 .713.288T13 18v3h2v-3q0-.425.288-.713T16 17q.425 0 .713.288T17 18v3h2v-5q0-1.25-.875-2.125T16 13H8q-1.25 0-2.125.875T5 16v5Zm8-10V3h-2v8h2Z"/></svg>Clear notes</div>
  </div>
    <div class="add_note center" onclick="openModal()">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z" clip-rule="evenodd"/></svg>
    </div>
    <div class="add_note_text">Add new note</div>
    <div class="search_option_dotes_container" onclick="openAddNoteSideMenu(this)">
      <img src="more.png" alt="Loading..." class="add_note_options">
    </div>
  </div>`;
  notesContainer.insertAdjacentHTML("afterbegin", addButton);

  notes.forEach(({ title, description, key, time, important, pinned }) => {
    let html = `<div class="note text_note ${important ? "red" : ""} ${
      pinned ? "pinned" : ""
    }" data-key=${key}>
    <div class="note_side_menu">
        <div class="menu_container">
        <div class="edit" onclick="handleEdit(this)"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" class="svg" viewBox="0 0 512 512"><path fill="currentColor" d="m410.3 231l11.3-11.3l-33.9-33.9l-62.1-62.1l-33.9-33.9l-11.3 11.3l-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2l22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5l-22.6 22.6l-11.4 11.3l33.9 33.9l62.1 62.1l33.9 33.9l11.3-11.3l22.6-22.6l14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg> Edit</div>
        <div class="delete" onclick="handleDelete(this)"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" class="svg" viewBox="0 0 448 512"><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg> Delete</div>
        <div class="important" onclick="handleImportant(this)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Zm5.293-1.293l6.4-6.4a.5.5 0 0 1 .654-.047l.853.64a1.5 1.5 0 0 1 .553 1.57L14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H8a1 1 0 0 1-1-1V8.414a1 1 0 0 1 .293-.707Z"/></svg>Imp</div>
        <div class="pin important" onclick="handlePinNote(this)"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" class="svg" viewBox="0 0 24 24"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M0 0h24v24H0z"/><path fill="currentColor" d="m15.113 3.21l.094.083l5.5 5.5a1 1 0 0 1-1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1-.158.277l-.07.08l-1.5 1.5a1 1 0 0 1-1.32.082l-.095-.083L9 16.415l-3.793 3.792a1 1 0 0 1-1.497-1.32l.083-.094L7.585 15l-2.792-2.793a1 1 0 0 1-.083-1.32l.083-.094l1.5-1.5a1 1 0 0 1 .258-.187l.098-.042l3.796-1.425l3.171-3.17a1 1 0 0 1 1.497-1.26z"/></g></svg>Pin</div>
        <div class="pin important" onclick="handleReadNote(this)"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" class="svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372zm87.5-334.7c34.8-12.8 78.4-49 78.4-119.2c0-71.2-45.5-131.1-144.2-131.1H378c-4.4 0-8 3.6-8 8v410c0 4.4 3.6 8 8 8h54.5c4.4 0 8-3.6 8-8V561.2h88.7l74.6 159.2c1.3 2.8 4.1 4.6 7.2 4.6h62a7.9 7.9 0 0 0 7.1-11.5l-80.6-164.2zM522 505h-81.5V357h83.4c48 0 80.9 25.3 80.9 75.5c0 46.9-29.8 72.5-82.8 72.5z"/></svg> Read</div>
      </div>
    </div>
    <div class="note_text">
        <div class="title ${important ? "white" : ""}">${
      title.length > titleLength.length
        ? title.slice(0, titleLength.length) + " ..."
        : title
    }</div>
        <span class="description ${important ? "white" : ""}">${
      description.length > descriptionLength.length
        ? description.slice(0, descriptionLength.length) + " ..."
        : description
    }</span>
    </div>
    <div class="note_dates ${important ? "white" : ""}">
        <div>${DateFormatter.format(time)}</div>
        <div class="option_dotes center" onclick="handleShowSideMenu(this,${important})">
        <div class="options">
          <img src="more.png" alt="Loading..." style="filter:invert(${
            important ? 1 : 0
          })">
        </div>
          
        </div>
    </div>
  </div>`;
    notesContainer.insertAdjacentHTML("beforeend", html);
    showFilterNotes()
  });
}

function handleRecoverNotes(element) {
  closeModal(recoverModal);
  let clickedRecoverNoteKey =
    element.parentElement.parentElement.getAttribute("data-recover-key");
  let deletedRecoverNotes = RECOVERED_NOTES.filter(
    (note) => note.key !== clickedRecoverNoteKey
  );
  let clickedRecoverNote = RECOVERED_NOTES.find(
    (note) => note.key == clickedRecoverNoteKey
  );
  notes.push(clickedRecoverNote);
  RECOVERED_NOTES = deletedRecoverNotes;

  saveRecoverNotes();
  saveNotes();
}

function handleReadSearchedNotes(element){
  let searchedKey = element.parentElement.parentElement.getAttribute("data-filter-key");
  let findedNote = notes.find(note => note.key == searchedKey);
  showReadedNoteContent(findedNote);
}

function showReadedNoteContent(findedNote){
  notesDates.textContent = DateFormatter.format(findedNote.time);
  notesText.textContent = findedNote.title;
  notesDescription.textContent = findedNote.description;

  showDialog(contentModal, true);
  closeModal(searchModal)
}

function showFilterNotes(){
  filter_notes.innerHTML = ""
  notes?.forEach(({ title, key }) => {
    filter_notes.innerHTML += `<div class="single_recover_note" data-filter-key=${key}>
      <div><strong>Title: </strong>${
        title.length > recoverNotesTitleLength.length
          ? title.slice(0, recoverNotesTitleLength.length) + "..."
          : title
      }</div>
      <div><button onclick="handleReadSearchedNotes(this)">Read</button></div>
  </div>`;
  });
}


function showRecoverNotes() {
  let LOCAL_RECOVER_NOTES = localStorage.getItem(RECOVER_NOTES_KEY);
  if (LOCAL_RECOVER_NOTES !== null) {
    RECOVERED_NOTES = JSON.parse(LOCAL_RECOVER_NOTES);
  } else {
    RECOVERED_NOTES = [];
  }
  let RECOVER_NOTES_CONTAINER = recoverModal.querySelector(
    "[class='recover_notes']"
  );

  RECOVER_NOTES_CONTAINER.innerHTML = "";

  if (RECOVERED_NOTES.length !== 0) {
    recoverButton.disabled = false;
    RECOVERED_NOTES.forEach(({ title, key }) => {
      RECOVER_NOTES_CONTAINER.innerHTML += `<div class="single_recover_note" data-recover-key=${key}>
    <div><strong>Title: </strong>${
      title.length > recoverNotesTitleLength.length
        ? title.slice(0, recoverNotesTitleLength.length) + "..."
        : title
    }</div>
    <div><button onclick="handleRecoverNotes(this)">Recover</button></div>
</div>`;
    });
  } else {
    recoverButton.disabled = true;
  }
}

addButton.addEventListener("click", () => {
  addButton.textContent = "Add note";
  AddNoteText.textContent = "Add note";
  if (title.value && description.value) {
    let notesObject = {
      key: crypto.randomUUID(),
      title: title.value,
      description: description.value,
      time: Date.now(),
      important: false,
      pinned: false,
    };
    if (!isEditing) {
      notes.push(notesObject);
    } else {
      notes[editIndex] = notesObject;
      isEditing = false;
    }
    saveNotes();

    title.value = "";
    description.value = "";
    closeModal(modal);
  } else {
    alert("You can not add empty note");
  }
});
