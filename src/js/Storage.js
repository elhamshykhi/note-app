export default class Storage {
  static getAllNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
  }

  static saveNote(note) {
    const allNotes = this.getAllNotes();
    const existedNote = allNotes.find((item) => item.id === note.id);

    if (existedNote) {
      existedNote.title = note.title;
      existedNote.text = note.text;
      existedNote.updated = new Date().toISOString();
    } else {
      note.id = Date.now();
      note.updated = new Date().toISOString();
      allNotes.push(note);
    }

    localStorage.setItem("notes", JSON.stringify(allNotes));
  }

  static deleteNote(id) {
    const allNotes = this.getAllNotes();
    const filteredNotes = allNotes.filter((item) => item.id !== id);

    localStorage.setItem("notes", JSON.stringify(filteredNotes));
  }
}
