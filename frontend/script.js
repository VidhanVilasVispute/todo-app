const API_URL = "http://localhost:3000";

// Fetch Todos
async function fetchTodos() {
    const response = await fetch(`${API_URL}/todos`);
    const todos = await response.json();
    
    const list = document.getElementById("todo-list");
    list.innerHTML = ""; 

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${todo.title}</strong>: ${todo.description} 
            <button onclick="editTodo('${todo.id}', '${todo.title}', '${todo.description}')">Edit</button>
            <button onclick="deleteTodo('${todo.id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}

// Add Todo
async function addTodo() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const response = await fetch(`${API_URL}/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
        fetchTodos();
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
    }
}

// Edit Todo
function editTodo(id, title, description) {
    document.getElementById("title").value = title;
    document.getElementById("description").value = description;

    document.getElementById("add-btn").style.display = "none";
    document.getElementById("update-btn").style.display = "inline";

    document.getElementById("update-btn").onclick = function () {
        updateTodo(id);
    };
}

// Update Todo
async function updateTodo(id) {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const response = await fetch(`${API_URL}/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed: false }),
    });

    if (response.ok) {
        fetchTodos();
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("add-btn").style.display = "inline";
        document.getElementById("update-btn").style.display = "none";
    }
}

// Delete Todo
async function deleteTodo(id) {
    const response = await fetch(`${API_URL}/todo/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        fetchTodos();
    }
}

// Load Todos on Page Load
window.onload = fetchTodos;
