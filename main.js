let notes = [];
const localStorageNotesKey = "notes";
const takenString = localStorage.getItem(localStorageNotesKey);

document.querySelector(".plus").addEventListener("click", newNote);

function newNote() {
  const title = document.querySelector(".title").value;
  const content = document.querySelector(".content").value;
  createNote(title, content, false, new Date().toLocaleString());
}

function createNote(noteTitle, noteContent, notePinned, noteDate) {
  const note = {
    title: noteTitle,
    content: noteContent,
    pinned: notePinned,
    date: noteDate,
  };
  notes.push(note);
  localStorage.setItem(localStorageNotesKey, JSON.stringify(notes));
  createNoteBox(JSON.stringify(note));
}

function createNoteBox(element) {
  const singleNote = document.createElement("div");
  singleNote.classList.add("singleNote");
  const elementParsed = JSON.parse(element);

  let content = `
        <p class= 'singleNote_date'>${elementParsed.date}</p>
        <h3 class = 'singleNote_title'>${elementParsed.title}</h3>
        <p class = 'singleNote_content'>${elementParsed.content}</p>
        <div class = 'singleNote_options'>
            <div class = 'singleNote_options_pinned' ></div>
            <div class = 'singleNote_options_delete' ></div>
            <div class = 'singleNote_options_palette'></div>
        </div>
    `;

  singleNote.innerHTML = content;
  document.querySelector(".othersNotes").appendChild(singleNote);
}

function addNote() {
  const notesTable = JSON.parse(takenString);
  notes = notesTable;
  if (notesTable) {
    for (let index = 0; index < notesTable.length; index++) {
      createNoteBox(JSON.stringify(notesTable[index]));
    }
  }
}

function deleteNote() {
  const deleteBtn = document.querySelectorAll(".singleNote_options_delete");
  const otherNotes = document.querySelector(".othersNotes");
  for (let index = 0; index < deleteBtn.length; index++) {
    deleteBtn[index].addEventListener("click", (e) => {
      otherNotes.removeChild(otherNotes.childNodes[index]);
    });
  }
}
function changeColour() {
  const colourPalette = document.createElement("div");
  colourPalette.classList.add("colourPaletteBox");
  let content = `
    <div class = 'oneColourOfThePalette darkGreen'></div>
    <div class = 'oneColourOfThePalette lightGreen'></div>
    <div class = 'oneColourOfThePalette lightOrange'></div>
    <div class = 'oneColourOfThePalette darkBlue'></div>
    `;

    colourPalette.innerHTML = content;
  const colourChangeBtn = document.querySelectorAll(
    ".singleNote_options_palette"
  );
  const singleNote = document.querySelectorAll(".singleNote");
  for (let index = 0; index < colourChangeBtn.length; index++) {
    colourChangeBtn[index].addEventListener("click", (e) => {
      singleNote[index].appendChild(colourPalette);
    });
  }
}
addNote();
deleteNote();
changeColour();
