class Note {
  title;
  content;
  created;
  pinned;
  color;

  constructor(title, content, color, pinned = false, created = null) {
    this.title = title;
    this.content = content;
    this.color = color;
    this.pinned = pinned;
    this.created = created ? created : new Date().toLocaleDateString();
  }

  renderNote() {
    const board = document.querySelector(".otherNotesBox");
    const boardWithPinnedNotes = document.querySelector(".pinnedNotesBox");

    const noteElement = document.createElement("div");
    noteElement.classList.add("otherNote");
    noteElement.classList.add(this.color);
    noteElement.innerHTML = `
    <p class = "singleNote_date">${this.created}</p>
    <h4 class = "singleNote_title">${this.title}</h4>
    <p class = "singleNote_content">${this.content}</p>
    <div class = "singleNote_options">
      <div class = "singleNote_options_editNote"></div>
      <div class = "singleNote_options_deleteNote"></div>
      <div class = "singleNote_options_pinNote"></div>
    </div>
    `;

    if (this.pinned) {
      boardWithPinnedNotes.appendChild(noteElement);
    } else {
      board.appendChild(noteElement);
    }
  }

  togglePined() {
    this.pinned = !this.pinned;
  }
}

class Notes {
  notes;
  selectedColor;

  constructor() {
    this.loadNotes();
    this.initColorSwitch();
    this.initCreatreNote();
    this.renderNotes();
  }

  initColorSwitch() {
    document.querySelectorAll(".oneColourBox").forEach((colorBox) => {
      colorBox.addEventListener("click", () => {
        document.querySelectorAll(".oneColourBox").forEach((colorBox) => {
          colorBox.classList.remove("selected");
        });

        this.selectedColor = colorBox.classList[1];
        colorBox.classList.add("selected");
      });
    });
  }

  initCreatreNote() {
    document.querySelector(".addButton").addEventListener("click", () => {
      this.addNote();
    });
  }

  initDeleteNote() {
    document
      .querySelectorAll(".singleNote_options_deleteNote")
      .forEach((noteDeleteButton, index) => {
        noteDeleteButton.addEventListener("click", () => {
          console.log(index);
          this.deleteNote(index);
        });
      });
  }

  initPinToggleNote() {
    document
      .querySelectorAll(".singleNote_options_pinNote")
      .forEach((notePinButton, index) => {
        notePinButton.addEventListener("click", () => {
          this.notes[index].togglePined();
          this.saveNotes();
          this.renderNotes();
        });
      });
  }

  loadNotes() {
    this.notes = [];
    const localNotesString = localStorage.getItem("notes");
    if (localNotesString) {
      const notesShapes = JSON.parse(localStorage.getItem("notes"));
      notesShapes.forEach((noteShape) => {
        const note = new Note(
          noteShape.title,
          noteShape.content,
          noteShape.color,
          noteShape.pinned,
          noteShape.created
        );
        this.notes.push(note);
      });
    }
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  addNote() {
    const title = document.querySelector(".title").value;
    const content = document.querySelector(".content").value;
    const color = this.selectedColor;
    if (!title) {
      alert("Wpisz title!");
      return;
    }
    if (!content) {
      alert("Wpisz content!");
      return;
    }
    if (!color) {
      alert("Wybierz color!");
      return;
    }

    this.clearNewNoteForm();
    const note = new Note(title, content, color);
    this.notes.push(note);
    this.saveNotes();
    this.renderNotes();
  }

  clearNewNoteForm() {
    document.querySelector(".title").value = "";
    document.querySelector(".content").value = "";
    const color = "";
    document.querySelectorAll(".oneColourBox").forEach((colorBox) => {
      colorBox.classList.remove("selected");
    });
  }

  renderNotes() {
    document.querySelector(".otherNotesBox").innerHTML = "";
    document.querySelector(".pinnedNotesBox").innerHTML = "";
    this.notes.forEach((note) => {
      note.renderNote();
    });
    this.initDeleteNote();
    this.initPinToggleNote();
  }

  deleteNote(noteIndex) {
    this.notes.splice(noteIndex, 1);
    this.saveNotes();
    this.renderNotes();
  }
}

const notes = new Notes();
