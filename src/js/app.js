const notesTableElement = document.querySelector("#notes-table tbody");
const summaryTableElement = document.querySelector("#summary-table tbody");

const showArchivedNotesButton = document.querySelector("#show-archived-notes-button");
const showActiveNotesButton = document.querySelector("#show-active-notes-button");

const addNoteButton = document.querySelector("#add-button");
const popupElement = document.querySelector(".popup");

import { seeds } from "./seeds.js";
import { formatDate, getDatesList } from "./lib/dates.js";
import { categories, getCategoryIcon, countNotesByCategory, formatCategory } from "./lib/categories.js";

let storedNotes = [];
let idIterator = 1;

function showActiveNotes() {
    let activeNotesHTML = "";
    storedNotes.map((note) => {
        if (!note.isArchived) {
            activeNotesHTML += `
            <tr>
                <td>
                    ${getCategoryIcon(note.category)}
                </td>
                <td>${note.name}</td>
                <td>${formatDate(note.created)}</td>
                <td>${note.category}</td>
                <td>${note.content}</td>
                <td>${getDatesList(note.content)}</td>
                
                <td class="control-panel">
                    <button onclick=showEditForm(${note.id})>
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button onclick=archiveNote(${note.id})>
                        <i class="fa-solid fa-box-archive"></i>
                    </button>
                    <button onclick=deleteNote(${note.id})>
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr> `;
        }
    });
    notesTableElement.innerHTML = activeNotesHTML;
}

function showArchivedNotes() {
    let archiveNotesHTML = "";
    storedNotes.map((note) => {
        if (note.isArchived) {
            archiveNotesHTML += `
            <tr>
                <td>
                    ${getCategoryIcon(note.category)}
                </td>
                <td>${note.name}</td>
                <td>${formatDate(note.created)}</td>
                <td>${note.category}</td>
                <td>${note.content}</td>
                <td>${getDatesList(note.content)}</td>
                
                <td class="control-panel">
                    <button onclick=unarchiveNote(${note.id})>
                        <i class="fa-solid fa-box-open"></i>
                    </button>
                    <button onclick=deleteNote(${note.id})>
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr> `;
        }
    });
    notesTableElement.innerHTML = archiveNotesHTML;
}

function showSummaryTable() {
    let summaryHTML = "";
    categories.map((category) => {
        let notesCount = countNotesByCategory(category.name, storedNotes);
        summaryHTML += `
        <tr>
            <td>${category.icon}</td>
            <td>${category.name}</td>
            <td>${notesCount.activeNotes}</td>
            <td>${notesCount.archivedNotes}</td>
        </tr> `;
    });
    summaryTableElement.innerHTML = summaryHTML
}

function seedNotes(seeds) {
    seeds.map((note) => {
        const newNote = {
            id: idIterator++,
            created: new Date(),
            isArchived: 0,
            ...note
        }
        storedNotes.push(newNote);
    })
}

window.deleteNote = function deleteNote(id) {
    storedNotes = storedNotes.filter(note => note.id !== id);
    showActiveNotes();
    showSummaryTable();
}

window.archiveNote = function archiveNote(id) {
    try {
        storedNotes.find(note => note.id === id).isArchived = 1;
        showActiveNotes();
        showSummaryTable();
    } catch (e) {
        console.log(`The note with ID ${id} can not be found.`);
        console.log("The note can not be archieved.");
    }
}

window.unarchiveNote = function unarchiveNote(id) {
    try {
        storedNotes.find(note => note.id === id).isArchived = 0;
        showArchivedNotes();
        showSummaryTable();
    } catch (e) {
        console.log(`The note with ID ${id} can not be found.`);
        console.log("The note can not be unarchieved.");
    }
}

function validateForm(formData) {
    const category = categories.find((c) => c.name === formData.getAll("category")[0]);
    return formData.getAll("name")[0] && category && formData.getAll("content")[0];
}

window.addNote = function addNote(event) {
    event.preventDefault();

    const addNoteForm = document.querySelector("#add-note-form");
    const formData = new FormData(addNoteForm);

    if (validateForm(formData)) {
       const newNote = {
            id: idIterator++,
            created: new Date(),
            name: formData.getAll("name")[0],
            category: formData.getAll("category")[0],
            content: formData.getAll("content")[0],
            isArchived: 0
        }
        storedNotes.push(newNote);
        dismissForm();
        showActiveNotes();
        showSummaryTable();
    } else {
        alert("Please fill all of the fields!");
    }
}

window.editNote = function editNote(event, id) {
    try {
        event.preventDefault();
        const editNoteIndex = storedNotes.findIndex(note => note.id === id)

        const editNoteForm = document.querySelector("#edit-note-form");
        const formData = new FormData(editNoteForm);

        if (validateForm(formData)) {
            storedNotes[editNoteIndex] = {
                ...storedNotes[editNoteIndex],
                name: formData.getAll("name")[0],
                category: formData.getAll("category")[0],
                content: formData.getAll("content")[0],
            }
            dismissForm();
            showActiveNotes();
            showSummaryTable();
        } else {
            alert("Please fill all of the fields!");
        }
    } catch (e) {
        console.log(`The note with ID ${id} can not be found.`);
        console.log("The note can not be edited.");
    }
}

window.dismissForm = function dismissForm() {
    popupElement.innerHTML = "";
    popupElement.classList.add("d-none");
}

function showRadioButtonsCategory() {
    let radioButtontsHTML = "";
    categories.map((category) => {
        radioButtontsHTML += `
        <input type="radio" id="edit-note-category-${formatCategory(category.name)}"
        name="category" value="${category.name}">            
        <label for="edit-note-category-${formatCategory(category.name)}">${category.name}</label>`;
    });
    return radioButtontsHTML;
}

window.showEditForm = function showEditForm(id) {
    try {
        popupElement.classList.remove("d-none");
        const editNote = storedNotes.find(note => note.id === id);
        
        popupElement.innerHTML = `
        <div class="popup-edit">
            <div class="card">
                <div class="card-header">Edit Note 
                    <button id="close-edit-note-form" onclick="dismissForm()">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="card-body">
                    <form id="edit-note-form" onsubmit="return editNote(event, ${id})">
                        <div>
                            <label for="edit-note-name-input">Name:</label>
                            <input type="text" name="name" id="edit-note-name-input" value="${editNote.name}">
                        </div>
                        <div>
                            <label for="edit-note-content-input">Content:</label>
                            <textarea name="content" id="edit-note-content-input">
                                ${editNote.content}
                            </textarea>
                        </div>
                        <div>
                            <p>Please select a note category:</p>
                            ${showRadioButtonsCategory()}
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>`;

        document.querySelector(`#edit-note-category-${formatCategory(editNote.category)}`).checked = true;
    } catch (e) {
        console.log(`The note with ID ${id} can not be found.`);
        console.log('Rendering edit form failed.');
    }
}

function showAddForm() {
    popupElement.classList.remove("d-none");
    popupElement.innerHTML = `
    <div class="popup-add">
        <div class="card">
            <div class="card-header">Add New Note 
                <button id="close-add-note-form" onclick="dismissForm()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="card-body">
                <form id="add-note-form" onsubmit="addNote(event)">
                    <div>
                        <label for="add-note-name-input">Name:</label>
                        <input type="text" name="name" id="add-note-name-input">
                    </div>
                    <div>
                        <label for="add-note-content-input">Content:</label>
                        <textarea name="content" id="add-note-content-input"></textarea>
                    </div>
                    <div>
                        <p>Please select a note category:</p>
                        ${showRadioButtonsCategory()}
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    </div>`;
}

showArchivedNotesButton.addEventListener("click", (e) => {
    e.preventDefault();
    showArchivedNotesButton.classList.add("d-none");
    showActiveNotesButton.classList.remove("d-none");
    showArchivedNotes();
});

showActiveNotesButton.addEventListener("click", (e) => {
    e.preventDefault();
    showActiveNotesButton.classList.add("d-none");
    showArchivedNotesButton.classList.remove("d-none");
    showActiveNotes();
});

addNoteButton.addEventListener("click", (e) => {
    e.preventDefault();
    showAddForm();
});

seedNotes(seeds);
showActiveNotes();
showSummaryTable();

