export const categories = [
    {
        name: "Task",
        icon: '<i class="fa-solid fa-list-check"></i>'
    },
    {
        name: "Random Thought",
        icon: '<i class="fa-solid fa-brain"></i>'
    },
    {
        name: "Idea",
        icon: '<i class="fa-regular fa-lightbulb"></i>'
    }, 
    {
        name: "Quote",
        icon: '<i class="fa-solid fa-quote-left"></i>'
    }
];

export function getCategoryIcon(category){
    return categories.find((c) => c.name === category).icon;
}

export function countNotesByCategory(category, storedNotes) {
    let activeNotes = 0;
    let archivedNotes = 0;
    storedNotes.map((note) => {
        if (note.category === category) {
            if (note.isArchived) {
                archivedNotes++;
            } else {
                activeNotes++;
            }
        }
    })
    return { activeNotes, archivedNotes }
}

export function formatCategory(category) {
    return category.toLowerCase().replace(" ", "-");
}