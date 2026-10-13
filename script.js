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

function createDarkTodoItem(text) {
    const todoItem = document.createElement("div");
    const todoText = document.createElement("span");
    const todoItemcompletedButton = document.createElement("button");
    const todoItemDeleteButton = document.createElement("button");

    todoText.textContent = text;
    todoItemcompletedButton.setAttribute("aria-label", "Mark as completed");
    todoItemDeleteButton.setAttribute("aria-label", "Delete");

    todoList.append(todoItem);
    todoItem.append(todoItemcompletedButton, todoText, todoItemDeleteButton);
    todoItem.classList.add("todo-item dark");

    todoItemcompletedButton.classList.add("todo-item-completed-button");

    todoText.classList.add("todo-text dark");

    todoItemDeleteButton.classList.add("todo-item-delete-button");

}

function createLightTodoItem(text) {
    const todoItem = document.createElement("div");
    const todoText = document.createElement("span");
    const todoItemcompletedButton = document.createElement("button");
    const todoItemDeleteButton = document.createElement("button");

    todoText.textContent = text;
    todoItemcompletedButton.setAttribute("aria-label", "Mark as completed");
    todoItemDeleteButton.setAttribute("aria-label", "Delete");

    todoList.append(todoItem);
    todoItem.append(todoItemcompletedButton, todoText, todoItemDeleteButton);
    todoItem.classList.add("todo-item light");

    todoItemcompletedButton.classList.add("todo-item-completed-button");

    todoText.classList.add("todo-text light");

    todoItemDeleteButton.classList.add("todo-item-delete-button");

}

function update() {
    const todoItems = document.querySelectorAll(".todo-item");
    const residual = todoItems.length;
    residualItems.textContent = `${residual} items left`;

    todoItems.forEach((item) => {
        const completedButton = item.querySelector(".todo-item-completed-button");
        const deleteButton = item.querySelector(".todo-item-delete-button");

        completedButton.addEventListener("click", () => {
            item.classList.toggle("completed");
            update();
        });

        deleteButton.addEventListener("click", () => {
            item.remove();
            update();
        });

        

    });

    
}