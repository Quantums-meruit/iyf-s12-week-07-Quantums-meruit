// Week 5 mini-project: Interactive To-Do List
"use strict";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filterButtons = document.querySelectorAll(".filter");
const clearCompletedButton = document.getElementById("clear-completed");
const emptyState = document.getElementById("empty-state");
const formMessage = document.getElementById("form-message");

// The array is the source of truth. The page is redrawn from this data.
let todos = [];
let currentFilter = "all";
let nextId = 1;
let pendingToggleTimer = null;

function getVisibleTodos() {
  if (currentFilter === "active") return todos.filter((todo) => !todo.completed);
  if (currentFilter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

function updateStats() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  itemsLeft.textContent = `${remaining} ${remaining === 1 ? "item" : "items"} left`;
  emptyState.classList.toggle("is-visible", getVisibleTodos().length === 0);
  emptyState.textContent = todos.length === 0
    ? "No tasks here yet. Add one above."
    : "No tasks match this filter.";
}

function createTodoElement(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.dataset.id = String(todo.id);
  if (todo.completed) item.classList.add("is-completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-check";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", `Mark ${todo.text} as ${todo.completed ? "active" : "completed"}`);

  const text = document.createElement("span");
  text.className = "todo-text";
  // textContent treats user input as text, not executable HTML.
  text.textContent = todo.text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);

  item.append(checkbox, text, deleteButton);
  return item;
}

function renderTodos() {
  todoList.replaceChildren();
  getVisibleTodos().forEach((todo) => todoList.appendChild(createTodoElement(todo)));
  updateStats();
}

function addTodo(text) {
  const cleanText = text.trim();
  if (!cleanText) {
    formMessage.textContent = "Please enter a task before adding it.";
    todoInput.focus();
    return;
  }

  todos.push({ id: nextId++, text: cleanText, completed: false });
  formMessage.textContent = "";
  todoInput.value = "";
  renderTodos();
  todoInput.focus();
}

function toggleTodo(id) {
  const todo = todos.find((entry) => entry.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

function startEditing(item, todo) {
  const textElement = item.querySelector(".todo-text");
  if (!textElement) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = todo.text;
  editInput.setAttribute("aria-label", "Edit task");
  textElement.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  let finished = false;
  function finishEditing(saveChanges) {
    if (finished) return;
    finished = true;
    const updatedText = editInput.value.trim();
    if (saveChanges && updatedText) todo.text = updatedText;
    renderTodos();
  }

  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finishEditing(true);
    if (event.key === "Escape") finishEditing(false);
  });
  editInput.addEventListener("blur", () => finishEditing(true));
}

// Form submission handles both clicking Add and pressing Enter.
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

// ONE delegated click listener handles task interactions, including future tasks.
// A short delay lets the browser distinguish a single click from a double-click.
todoList.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item || !todoList.contains(item)) return;

  const id = Number(item.dataset.id);
  if (event.target.closest("[data-action='delete']")) {
    clearTimeout(pendingToggleTimer);
    pendingToggleTimer = null;
    deleteTodo(id);
    return;
  }

  if (event.target.matches(".todo-check")) {
    clearTimeout(pendingToggleTimer);
    pendingToggleTimer = null;
    toggleTodo(id);
    return;
  }

  if (event.target.closest(".todo-text")) {
    if (event.detail > 1) return;
    clearTimeout(pendingToggleTimer);
    pendingToggleTimer = setTimeout(() => {
      toggleTodo(id);
      pendingToggleTimer = null;
    }, 500);
  }
});

// Double-click cancels the pending single-click toggle and starts editing.
todoList.addEventListener("dblclick", (event) => {
  const textElement = event.target.closest(".todo-text");
  if (!textElement) return;

  clearTimeout(pendingToggleTimer);
  pendingToggleTimer = null;
  const item = textElement.closest(".todo-item");
  const todo = todos.find((entry) => entry.id === Number(item.dataset.id));
  if (todo) startEditing(item, todo);
});

// Keyboard support for toggling and editing via the visible task row.
todoList.addEventListener("keydown", (event) => {
  if (event.target.matches(".todo-text") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    const item = event.target.closest(".todo-item");
    toggleTodo(Number(item.dataset.id));
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
  });
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
});

renderTodos();
