import { getState, subscribe, updateTodos, updateFilter } from "./state.js";

import {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompletedTodos,
} from "./todo-logic.js";

import { renderTodos } from "./ui.js";

// Get the HTML elements.
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const clearCompletedButton = document.querySelector("#clear-completed");
const formMessage = document.querySelector("#form-message");

// Generate the next task ID.
function getNextId() {
  const todos = getState().todos;

  if (todos.length === 0) {
    return 1;
  }

  return Math.max(...todos.map((todo) => todo.id)) + 1;
}

let nextId = getNextId();

// Handle adding a new task.
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    formMessage.textContent = "Please enter a task.";
    return;
  }

  const updatedTodos = addTodo(getState().todos, text, nextId);

  updateTodos(updatedTodos);

  nextId += 1;
  todoForm.reset();
  formMessage.textContent = "";
  todoInput.focus();
});

// Handle task actions using event delegation.
todoList.addEventListener("change", (event) => {
  if (event.target.dataset.action !== "toggle") {
    return;
  }

  const listItem = event.target.closest("li");
  const id = Number(listItem.dataset.id);

  const updatedTodos = toggleTodo(getState().todos, id);

  updateTodos(updatedTodos);
});

todoList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('[data-action="delete"]');

  if (!deleteButton) {
    return;
  }

  const listItem = deleteButton.closest("li");
  const id = Number(listItem.dataset.id);

  const updatedTodos = deleteTodo(getState().todos, id);

  updateTodos(updatedTodos);
});

// Handle clearing completed tasks.
clearCompletedButton.addEventListener("click", () => {
  const updatedTodos = clearCompletedTodos(getState().todos);

  updateTodos(updatedTodos);
});

// Handle filter selection.
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    updateFilter(button.dataset.filter);
  });
});

// Render the interface whenever state changes.
subscribe(renderTodos);

// Display the initial application state.
renderTodos(getState());
