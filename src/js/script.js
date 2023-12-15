const addNoteBtn = document.querySelector("#add_note_btn");
const addNoteForm = document.querySelector("#add_note_form");

addNoteBtn.addEventListener("click", () => {
  addNoteForm.classList.remove("hidden");
});
