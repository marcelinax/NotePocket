function findById(l,id){
  let found = null;
  l.forEach(element =>{
    if(element.attributes && element.attributes[1].value == id){
      found = element;
    }
  });
  return found;
}

class DB {
  constructor() {
    this.notes = []; // tablica notatek zczytywana z localStorage
    this.counter = 0; // numer notatki
  }
 
  // pobranie numeru notatki

  getCounter() {
    this.counter = this.getAnIncrementCounter();
    return this.counter;
  }

  // ustawienie numeru dla notatki w localStorage

  getAnIncrementCounter() {
    let counter = this.actualNumberOfNote();
    localStorage.setItem("notesCount", counter + 1);
    return counter;
  }

  // dodawanie notatki do localStorage za pośrednictwem id notatki

  addNoteToLocalStorage(note) {
    note.id = this.getCounter(); // przypisanie id do poszczególnej notatki
    localStorage.setItem(`note${note.id}`, JSON.stringify(note));
    return note;
  }
  
  // zczytywanie numeru ostatnio dodanej notatki w localStorage

  actualNumberOfNote() {
    const noteNumber = parseInt(localStorage.getItem("notesCount"));
    if (!noteNumber || noteNumber == 0) return 0;
    else return noteNumber;
  }

  // zczytywanie i dodawanie każdej notatki po kolei do tablicy z localStorage

  readFromLocalStorage() {
    // this.notes = [];
    for (let i = 0; i < localStorage.length - 1; i++) {
      this.notes.push(JSON.parse(localStorage.getItem(`note${i}`)));
    }
    console.log(this.notes);
  }


  changeLocalStorage(){
    const notes = this.getAllNotes();
    localStorage.clear();
    this.counter = -1;
    for(let i =0 ; i< notes.length; i++){
      const note = JSON.parse(notes[i]);
      localStorage.setItem(`note${this.getCounter()}`,JSON.stringify(note));
      this.getAnIncrementCounter();
    }
    window.location.reload()
  }
  changeLocalStorage(){
    const notes = this.getAllNotes();
    localStorage.clear();
    this.counter = -1;
    for(let i =0 ; i< notes.length; i++){
      const note = JSON.parse(notes[i]);
      localStorage.setItem(`note${this.getCounter()}`,JSON.stringify(note));
      this.getAnIncrementCounter();
    }
    // window.location.reload()
  }



  // zwracanie tablicy notatek

  getAllNotes() {
    this.readFromLocalStorage();
    return this.notes;
  }
}

class Notes {
  constructor() {
    this.baza = new DB(); // utworzenie instancji klasy DB
    this.notes = this.baza.getAllNotes(); // przypiasnie tablicy notatek zwracanej z klasy DB
  }

  // utworzenie nowej notatki

  createNote(noteTitle, noteContent, noteDate) {
    const colour = this.getCurrentColour()
    const note = {
      title: noteTitle,
      content: noteContent,
      date: noteDate,
      color: colour,
    };
    return this.baza.addNoteToLocalStorage(note); // dodanie notatki do localStorage
  }
 
  getCurrentColour(){
    const colours = document.querySelectorAll('.oneColourBox');
    const form = [
      {
        className: "default_purple--active",
        colourName: "purple",
      },
      {
        className: "grey--active",
        colourName: "grey",
      },
      {
        className: "lightPink--active",
        colourName: "lightPink",
      },
      {
        className: "darkOrange--active",
        colourName: "darkOrange",
      },
    ];
    let targetClassName = "";
    let targetColour;

    for(let i = 0; i <colours.length;i++){
      if(colours[i].classList.length == 3){
        targetClassName = colours[i].classList[2];
      }
    }
    form.map(value=>{
      if(value.className == targetClassName){
        console.log(value.colourName);
        targetColour = value.colourName;
        return value.colourName;
      }
    });
     return targetColour;
  }
  changeColourOfNote(){
    let current = 0;
    const currentClass = [
      "default_purple--active",
      "grey--active",
      "lightPink--active",
      "darkOrange--active",
    ];
    const colourBtn = document.querySelectorAll('.oneColourBox');
    
    for(let i = 0; i < colourBtn.length; i++){
      colourBtn[i].addEventListener('click', ()=>{
        colourBtn[current].classList.remove(currentClass[current]);
        current = i;
        colourBtn[i].classList.add(currentClass[i]);
      });
    }
  }

  deleteNote(){
    return this.baza.changeLocalStorage()
  }
  
  // zwrócenie tablicy notatek

  getNotes() {
    return this.notes;
  }
}

class Visual {
  constructor() {
    this.notes = new Notes(); // utworzenie instancji klasy Notes
    this.notesArray = this.notes.getNotes(); // przypisanie tablicy notatek z klasy Notes
    this.board = document.querySelector(".otherNotesBox");
    this.boardWithPinnedNotes = document.querySelector('.pinnedNotesBox');

  }

  // utworzenie notatki po uzupełnieniu pól formularza

  addNewNote() {
    const addBtn = document.querySelector(".addButton");
    addBtn.addEventListener("click", () => {
      const title = document.querySelector(".title").value;
      const area = document.querySelector(".content").value;
      if (title != "" || area != "") {
        const note = this.notes.createNote(
          title,
          area,
          new Date().toLocaleString()
        );
        this.createNote(note);
      } else alert("Wypełnij pola!");
    });
  }

  // utworzenie diva dla pojedynczej notatki

  createNoteBox(element) {
    const singleNote = document.createElement("div");
    singleNote.classList.add("otherNote");
    singleNote.dataset.id = element.id;
    singleNote.classList.add(`${element.color}`)

    let obj = `
    <p class = "singleNote_date">${element.date}</p>
    <h4 class = "singleNote_title">${element.title}</h4>
    <p class = "singleNote_content">${element.content}</p>
    <div class = "singleNote_options">
      <div class = "singleNote_options_editNote"></div>
      <div class = "singleNote_options_deleteNote" dataset-key = "${element.id}"></div>
      <div class = "singleNote_options_pinNote" dataset-key = "${element.id}"></div>
    </div>
    `;
    singleNote.innerHTML = obj;
    return singleNote;
  }

  // wrzucanie utworzonych divów z notatkami do jednego boxa

  createNoteBoard() {
    const notes = this.notesArray;
    for (let i = 0; i < notes.length; i++) {
      this.createNote(notes[i]);
    }
  }

  // wyświetlenie notatki na stronie

  createNote(note) {
    this.board.appendChild(this.createNoteBox(note));
  }

  // usuwanie notatki po jej id

  // deleteNote() {
  //   const deleteBtn = document.querySelectorAll(
  //     ".singleNote_options_deleteNote"
  //   );
  //   for (let i = 0; i < deleteBtn.length; i++) {
  //     deleteBtn[i].addEventListener("click", () => {
        
  //       if(deleteBtn[i].attributes[1].value== this.notesArray[i].id){
  //       localStorage.removeItem(`note${this.notesArray[deleteBtn[i].attributes[1].value]}`);
  //       this.notes.deleteNote();
  //       }
  //     });
  //   }
  // }
  // deleteNote() {
  //   const deleteBtn = document.querySelectorAll(
  //     ".singleNote_options_deleteNote"
  //   );
  //   for (let i = 0; i < deleteBtn.length; i++) {
  //     deleteBtn[i].addEventListener("click", () => {
  //       const d = deleteBtn[i].attributes[1].value;
  //       console.log(this.notesArray[i].id == d)
  //       if(this.notesArray[i].id == d){
  //         localStorage.removeItem(`note${this.notesArray[i].id}`);
  //       }
  //       return this.notesArray
  //      console.log(this.notesArray) 
  //     });
  //   }
  // }
  
  deleteNote() {
    const deleteBtn = document.querySelectorAll(
      ".singleNote_options_deleteNote"
    );
    for (let i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].addEventListener("click", () => {
        const d = deleteBtn[i].attributes[1].value;
        console.log(this.notesArray[i].id == d)
        if(this.notesArray[i].id == d){
          localStorage.removeItem(`note${this.notesArray[i].id}`);
        }
       console.log(this.notesArray) 
      });
    }
  }
    pinNote(){
      const pinBtn = document.querySelectorAll('.singleNote_options_pinNote');
      for(let i = 0 ; i < pinBtn.length ; i++ ){
       pinBtn[i].addEventListener('click', () =>{
        const pin = pinBtn[i].attributes[1].value;

        let note = findById(this.board.childNodes, pin);
        if(note){
          this.boardWithPinnedNotes.appendChild(note);
        }
       
        // console.dir(pin)
        // this.boardWithPinnedNotes.appendChild((this.board).childNodes[pin])
        // console.log(this.boardWithPinnedNotes.appendChild((this.board).childNodes[pin]))
      })  
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const b = new DB();
  const v = new Visual();
  v.addNewNote();
  v.createNoteBoard();
  
  v.pinNote()
 const n = new Notes()
 n.changeColourOfNote()
 v.deleteNote()
});
