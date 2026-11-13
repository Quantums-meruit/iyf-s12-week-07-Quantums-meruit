import {
  getVisibleTodos,
  getActiveTodoCount,
} from "./todo-logic.js";

const todoList = document.querySelector("#todo-list");
const itemsLeft = document.querySelector("#items-left");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");

export function renderTodos(state) {
  if (!todoList) {
    return;
  }

  todoList.replaceChildren();

  const visibleTodos = getVisibleTodos(state.todos, state.currentFilter);

  visibleTodos.forEach((todo) => {
    const listItem = document.createElement("li");
    listItem.className = "todo-item";
    listItem.dataset.id = todo.id;

    if (todo.completed) {
      listItem.classList.add("is-completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.checked = todo.completed;
    checkbox.dataset.action = "toggle";
    checkbox.setAttribute("aria-label", `Mark ${todo.text} as complete`);

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";
    deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);

    listItem.append(checkbox, todoText, deleteButton);
    todoList.appendChild(listItem);
  });

  const activeCount = getActiveTodoCount(state.todos);

  if (itemsLeft) {
    itemsLeft.textContent = `${activeCount} ${activeCount === 1 ? "item" : "items"} left`;
  }

  if (emptyState) {
    emptyState.classList.toggle("is-visible", visibleTodos.length === 0);
  }

  if (clearCompletedButton) {
    clearCompletedButton.disabled = !state.todos.some((todo) => todo.completed);
  }

  document.querySelectorAll(".filter").forEach((button) => {
    const isActive = button.dataset.filter === state.currentFilter;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}
