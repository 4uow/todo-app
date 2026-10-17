const todoInput = document.getElementById("new-todo");
const turnToDarkButton = document.getElementById("turn-to-dark");
const turnToLightButton = document.getElementById("turn-to-light");
const body = document.body;
const darkBg = document.getElementById("dark-bg");
const lightBg = document.getElementById("light-bg");
const residualItems = document.getElementById("residual-items");
const todoList = document.querySelector(".todo-list");
const controlArea = document.querySelector(".control-area");
const all = document.getElementById("all");
const active = document.getElementById("active");
const completed = document.getElementById("completed");
const clearCompleted = document.querySelector("#clear-completed");
const controlButtonsText = document.querySelectorAll(".control-button-text");
const inputArea = document.querySelector(".input-area");
const filterButtons = document.querySelector(".filter-buttons");
const clearCompletedButton = document.getElementById("clear-completed");
const textcontent = document.querySelector(".textcontent");

function createDarkTodoItem(text) {
    const todoItem = document.createElement("div");
    const todoText = document.createElement("span");
    const todoItemcompletedButton = document.createElement("button");
    const todoItemDeleteButton = document.createElement("button");
    const todoItemDeleteIcon = document.createElement("img");
    const todoItemCompletedIcon = document.createElement("img");


    todoItemCompletedIcon.src = "./images/icon-check.svg";
    todoItemCompletedIcon.alt = "";
    todoItemCompletedIcon.hidden = true;

    todoItemDeleteIcon.src = "./images/icon-cross.svg";
    todoItemDeleteIcon.alt = "";

    todoText.textContent = text;
    todoItemcompletedButton.setAttribute("aria-label", "Mark as completed");
    todoItemDeleteButton.setAttribute("aria-label", "Delete");

    todoList.append(todoItem);
    todoItem.append(todoItemcompletedButton, todoText, todoItemDeleteButton);
    todoItemDeleteButton.append(todoItemDeleteIcon);
    todoItemcompletedButton.append(todoItemCompletedIcon);
    todoItem.classList.add("todo-item");
    todoItem.draggable = true;
    todoItem.classList.add("dark");

    todoItemcompletedButton.classList.add("todo-item-completed-button");

    todoText.classList.add("todo-text");
    todoText.classList.add("dark");

    todoItemDeleteButton.classList.add("todo-item-delete-button");

    todoItemDeleteIcon.classList.add("todo-item-delete-icon");
    todoItemCompletedIcon.classList.add("todo-item-completed-icon");

    todoItemDeleteButton.addEventListener("click", () => {
        todoItem.remove();
        update();
    });

    todoItemcompletedButton.addEventListener("click", () => {
        todoItem.classList.toggle("completed");
        todoItemcompletedButton.classList.toggle("completed");
        todoItemCompletedIcon.hidden = !todoItemcompletedButton.classList.contains("completed");
        todoText.classList.toggle("completed");
        update();
    });

    return todoItem;

}

function createLightTodoItem(text) {
    const todoItem = document.createElement("div");
    const todoText = document.createElement("span");
    const todoItemcompletedButton = document.createElement("button");
    const todoItemDeleteButton = document.createElement("button");
    const todoItemDeleteIcon = document.createElement("img");
    const todoItemCompletedIcon = document.createElement("img");

    todoText.textContent = text;
    todoItemcompletedButton.setAttribute("aria-label", "Mark as completed");
    todoItemDeleteButton.setAttribute("aria-label", "Delete");

    todoItemDeleteIcon.src = "./images/icon-cross.svg";
    todoItemDeleteIcon.alt = "";
    todoItemCompletedIcon.src = "./images/icon-check.svg";
    todoItemCompletedIcon.alt = "";
    todoItemCompletedIcon.hidden = true;

    todoList.append(todoItem);
    todoItem.append(todoItemcompletedButton, todoText, todoItemDeleteButton);
    todoItemDeleteButton.append(todoItemDeleteIcon);
    todoItemcompletedButton.append(todoItemCompletedIcon);
    

    todoItem.classList.add("todo-item");
    todoItem.draggable = true;
    todoItem.classList.add("light");

    todoItemcompletedButton.classList.add("todo-item-completed-button");

    todoText.classList.add("todo-text");
    todoText.classList.add("light");

    todoItemDeleteButton.classList.add("todo-item-delete-button");

    todoItemDeleteIcon.classList.add("todo-item-delete-icon");
    todoItemCompletedIcon.classList.add("todo-item-completed-icon");

    todoItemDeleteButton.addEventListener("click", () => {
        todoItem.remove();
        update();
    });

    todoItemcompletedButton.addEventListener("click", () => {
        todoItem.classList.toggle("completed");
        todoItemcompletedButton.classList.toggle("completed");
        todoItemCompletedIcon.hidden = !todoItemcompletedButton.classList.contains("completed");
        todoText.classList.toggle("completed");
        update();
    });

    return todoItem;

}

function saveTodos() {
    const todos = [...todoList.querySelectorAll(".todo-item")].map((item) => ({
        text: item.querySelector(".todo-text").textContent,
        completed: item.classList.contains("completed"),
    }));
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    let todos;

    try {
        todos = JSON.parse(localStorage.getItem("todos")??"[]");

    }catch{
        todos = [];
    }

    if(!Array.isArray(todos)) {
        todos = [];
    }

    todos.forEach((todo) => {
        if(!todo || typeof todo.text !== "string" || typeof todo.completed !== "boolean") {
            return;
        }

        const item = body.classList.contains("dark") ? createDarkTodoItem(todo.text) : createLightTodoItem(todo.text);
        if(todo.completed) {
            item.classList.add("completed");
            const completedButton = item.querySelector(".todo-item-completed-button");
            completedButton.classList.add("completed");
            const completedIcon = item.querySelector(".todo-item-completed-icon");
            completedIcon.hidden = false;
            const todoText = item.querySelector(".todo-text");
            todoText.classList.add("completed");
        }
    });

    update();
}

function update() {
    const todoItems = document.querySelectorAll(".todo-item");
    const completedItems = document.querySelectorAll(".todo-item.completed");
    const residual = todoItems.length - completedItems.length;


    residualItems.textContent = `${residual} items left`;

    
    todoItems.forEach((item) => {
        const iscompleted = item.classList.contains("completed");
        if(all.checked) {
            item.hidden = false;
    }

        else if(active.checked) {
            item.hidden = iscompleted
        }

        else if(completed.checked) {
            item.hidden = !iscompleted
        }
    });


    saveTodos();
}

function getTodoAfterElement(container, y) {
    const items = [...container.querySelectorAll(".todo-item:not(.dragging):not([hidden])")];

    return items.reduce((closest,item) => {
        const box = item.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {return { offset: offset, element: item };
        }

        else {return closest;}
    },{offset: Number.NEGATIVE_INFINITY, element: null}).element;
}

let draggedTodo = null;

todoList.addEventListener("dragstart", (event) => {
    const item = event.target.closest(".todo-item");
        
    if(item) {
        draggedTodo = item;
        item.classList.add("dragging");

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", "");
    }
});

todoList.addEventListener("dragover", (event) => {
    event.preventDefault();

    if(!draggedTodo) return;

    const afterElement = getTodoAfterElement(todoList, event.clientY);

    if (afterElement == null) {
        todoList.appendChild(draggedTodo);
    } else {
        todoList.insertBefore(draggedTodo, afterElement);
    }
});

todoList.addEventListener("drop", (event) => {
    event.preventDefault();
    update();
});

todoList.addEventListener("dragend", () => {
    if(draggedTodo) {
        draggedTodo.classList.remove("dragging");
        draggedTodo = null;
    }
    update();
});


all.addEventListener("change", () => {
    update();
});

active.addEventListener("change", () => {
    update();
});

completed.addEventListener("change", () => {
    update();
});

clearCompleted.addEventListener("click",() => {
    const todoItems = document.querySelectorAll(".todo-item");
    todoItems.forEach((item) => {
        if(item.classList.contains("completed")) {
            item.remove();
        }
    });
    update();
});

//moonbutton
turnToDarkButton.addEventListener("click", () => {
    body.classList.add("dark");
    body.classList.remove("light");
    darkBg.hidden = false;
    lightBg.hidden = true;
    turnToLightButton.hidden = false;
    turnToDarkButton.hidden = true;
    clearCompletedButton.classList.add("dark");
    clearCompletedButton.classList.remove("light");
    textcontent.classList.add("dark");
    textcontent.classList.remove("light");
    filterButtons.classList.add("dark");
    filterButtons.classList.remove("light");
    controlButtonsText.forEach((button) => {
        button.classList.add("dark");
        button.classList.remove("light");
    });
    inputArea.classList.add("dark");
    inputArea.classList.remove("light");
    todoList.classList.add("dark");
    todoList.classList.remove("light");
    controlArea.classList.add("dark");
    controlArea.classList.remove("light");
    const todoItems = document.querySelectorAll(".todo-item");
    todoItems.forEach((item) => {
        item.classList.add("dark");
        item.classList.remove("light");
        const todoText = item.querySelector(".todo-text");
        todoText.classList.add("dark");
        todoText.classList.remove("light");
    });
});

//sunbutton
turnToLightButton.addEventListener("click", () => {
    body.classList.add("light");
    body.classList.remove("dark");
    darkBg.hidden = true;
    lightBg.hidden = false;
    turnToLightButton.hidden = true;
    turnToDarkButton.hidden = false;
    clearCompletedButton.classList.add("light");
    clearCompletedButton.classList.remove("dark");
    filterButtons.classList.add("light");
    filterButtons.classList.remove("dark");
    textcontent.classList.add("light");
    textcontent.classList.remove("dark");
    controlButtonsText.forEach((button) => {
        button.classList.add("light");
        button.classList.remove("dark");
    });
    inputArea.classList.add("light");
    inputArea.classList.remove("dark");
    todoList.classList.add("light");
    todoList.classList.remove("dark");
    controlArea.classList.add("light");
    controlArea.classList.remove("dark");
    const todoItems = document.querySelectorAll(".todo-item");
    todoItems.forEach((item) => {
        item.classList.add("light");
        item.classList.remove("dark");
        const todoText = item.querySelector(".todo-text");
        todoText.classList.add("light");
        todoText.classList.remove("dark");
    });
});

todoInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        const text = todoInput.value.trim();
        if(text) {
            if(body.classList.contains("dark")) {
                createDarkTodoItem(text);
            }else if(body.classList.contains("light")) {
                createLightTodoItem(text);
            }
            todoInput.value = "";
            update();
        }
    }
});

loadTodos();
