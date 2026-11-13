import {
  getState,
  subscribe,
  updateTodos,
  updateFilter,
} from "./state.js";

import {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompletedTodos,
  editTodo,
} from "./todo-logic.js";

import { renderTodos } from "./ui.js";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const clearCompletedButton = document.querySelector("#clear-completed");
const formMessage = document.querySelector("#form-message");

function getNextId() {
  const todos = getState().todos;

  return todos.length === 0
    ? 1
    : Math.max(...todos.map((todo) => Number(todo.id) || 0)) + 1;
}

let nextId = getNextId();

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    formMessage.textContent = "Please enter a task.";
    todoInput.focus();
    return;
  }

  updateTodos(addTodo(getState().todos, text, nextId));
  nextId += 1;
  todoForm.reset();
  formMessage.textContent = "";
  todoInput.focus();
});

todoList.addEventListener("change", (event) => {
  if (event.target.dataset.action !== "toggle") {
    return;
  }

  const listItem = event.target.closest(".todo-item");

  if (!listItem) {
    return;
  }

  updateTodos(toggleTodo(getState().todos, Number(listItem.dataset.id)));
});

todoList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('[data-action="delete"]');

  if (!deleteButton) {
    return;
  }

  const listItem = deleteButton.closest(".todo-item");

  if (!listItem) {
    return;
  }

  updateTodos(deleteTodo(getState().todos, Number(listItem.dataset.id)));
});

todoList.addEventListener("dblclick", (event) => {
  const todoText = event.target.closest(".todo-text");

  if (!todoText) {
    return;
  }

  const listItem = todoText.closest(".todo-item");
  const id = Number(listItem.dataset.id);
  const originalText = todoText.textContent;
  const editInput = document.createElement("input");

  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = originalText;
  editInput.setAttribute("aria-label", "Edit task");

  todoText.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  let finished = false;

  function finishEditing(saveChanges) {
    if (finished) {
      return;
    }

    finished = true;

    if (saveChanges && editInput.value.trim()) {
      updateTodos(editTodo(getState().todos, id, editInput.value));
    } else {
      renderTodos(getState());
    }
  }

  editInput.addEventListener("keydown", (keyEvent) => {
    if (keyEvent.key === "Enter") {
      finishEditing(true);
    }

    if (keyEvent.key === "Escape") {
      finishEditing(false);
    }
  });

  editInput.addEventListener("blur", () => finishEditing(true));
});

clearCompletedButton.addEventListener("click", () => {
  updateTodos(clearCompletedTodos(getState().todos));
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    updateFilter(button.dataset.filter);
  });
});

subscribe(renderTodos);
renderTodos(getState());
