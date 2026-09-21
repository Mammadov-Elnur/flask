document.addEventListener("DOMContentLoaded", fetchNotes);

const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");

async function fetchNotes() {
    try {
        const response = await fetch("/api/notes");
        const notes = await response.json();
        
        notesContainer.innerHTML = "";
        
        if (notes.length === 0) {
            notesContainer.innerHTML = "<p>No notes found. Add one above!</p>";
            return;
        }

        notes.forEach(note => {
            const card = document.createElement("div");
            card.className = "note-card";
            card.innerHTML = `<h3>${escapeHtml(note.title)}</h3><p>${escapeHtml(note.content)}</p>`;
            notesContainer.appendChild(card);
        });
    } catch (error) {
        notesContainer.innerHTML = "<p>Error loading notes.</p>";
    }
}

noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
        const response = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            fetchNotes();
        }
    } catch (error) {
        alert("Failed to save note");
    }
});

function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}