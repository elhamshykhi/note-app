import Storage from "./Storage.js";

const addNoteBtn = document.querySelector("#add_note_btn");
const addNoteForm = document.querySelector("#add_note_form");

const saveNoteBtn = document.querySelector("#save_note_btn");
const cancelNoteBtn = document.querySelector("#cancel_note_btn");

const noteTitle = document.querySelector("#input_title");
const noteText = document.querySelector("#input_text");

class App {
  constructor() {
    addNoteBtn.addEventListener("click", () => {
      addNoteForm.classList.remove("hidden");
    });

    saveNoteBtn.addEventListener("click", (e) => {
      if (saveNoteBtn.innerHTML.trim() === "save note") {
        this.addNewNote();
      } else if (saveNoteBtn.innerHTML.trim() === "edit note") {
        this.editNote();
      }
    });

    cancelNoteBtn.addEventListener("click", () => this.cancelEditNote());

    this.activeNote = null;
    this.setupApp();
  }

  setupApp() {
    this.updateNotesList();
  }

  addNewNote() {
    const title = noteTitle.value;
    const text = noteText.value;

    if (!title || !text) return;

    Storage.saveNote({ title, text });

    this.resetInputFieldsValue();

    addNoteForm.classList.add("hidden");
    this.updateNotesList();
  }

  updateNotesList() {
    const notesList = document.querySelector("#notes_preview_list");
    const notes = Storage.getAllNotes();

    if (notes.length) {
      notesList.innerHTML = notes
        .sort((a, b) => (new Date(a.updated) > new Date(b.updated) ? -1 : 1))
        .map((note) => this.createNote(note))
        .join("");
    } else {
      notesList.innerHTML = `<p class="text-gray-500 capitalize text-center">there is not any note...</p>`;
    }

    const notesListItems = [...document.querySelectorAll(".notes_list_item")];

    notesListItems.forEach((item) =>
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete_btn")) {
          this.deleteNote(Number(item.dataset.id));
        } else {
          this.selectNoteItem(Number(item.dataset.id));
        }
      })
    );
  }

  createNote({ id, title, text, updated }) {
    return `<div data-id="${id}" class="notes_list_item bg-gray-800 p-3 cursor-pointer rounded-xl border-2 border-gray-800">
        <div class="flex items-center justify-between">
          <p class="text-gray-50 font-semibold capitalize text-lg">
            ${title}
          </p>

          <button
            type="button"
            data-id="${id}"
            class="delete_btn py-1.5 rounded-full text-gray-600 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 pointer-events-none"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
        <span class="text-gray-500 uppercase text-xs mb-1 block">
          ${new Date(updated).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>
        <p class="text-gray-400 first-letter:capitalize line-clamp-3">
          ${text}
        </p>
        </div>`;
  }

  deleteNote(id) {
    Storage.deleteNote(id);
    this.updateNotesList();
  }

  selectNoteItem(id) {
    const allNotes = Storage.getAllNotes();
    this.activeNote = allNotes.find((item) => item.id === id);

    this.updateActiveNote(this.activeNote);

    addNoteForm.classList.remove("hidden");

    saveNoteBtn.innerHTML = "edit note";
    cancelNoteBtn.classList.remove("sm:hidden");
  }

  cancelEditNote() {
    saveNoteBtn.innerHTML = "save note";
    cancelNoteBtn.classList.add("sm:hidden");

    addNoteForm.classList.add("hidden");

    this.activeNote = null;
    this.updateActiveNote(this.activeNote);
  }

  updateActiveNote(note) {
    if (note) {
      noteTitle.value = note.title;
      noteText.value = note.text;

      document
        .querySelectorAll(".notes_list_item")
        .forEach((item) => item.classList.remove("selectedNote"));

      document
        .querySelector(`.notes_list_item[data-id="${note.id}"]`)
        .classList.add("selectedNote");
    } else {
      this.resetInputFieldsValue();

      document
        .querySelectorAll(".notes_list_item")
        .forEach((item) => item.classList.remove("selectedNote"));
    }
  }

  editNote() {
    const title = noteTitle.value;
    const text = noteText.value;

    if (!title || !text) return;

    Storage.saveNote({ id: this.activeNote.id, title, text });

    this.resetInputFieldsValue();

    addNoteForm.classList.add("hidden");
    saveNoteBtn.innerHTML = "save note";
    this.updateNotesList();
  }

  resetInputFieldsValue() {
    noteTitle.value = "";
    noteText.value = "";
  }
}

const app = new App();
