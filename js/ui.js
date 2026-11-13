import { getVisibleTodos } from "./todo-logic.js";

// Get the HTML elements we need.
const todoList = document.querySelector("#todo-list");
const itemsLeft = document.querySelector("#items-left");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");

// Displays tasks and updates the interface.
export function renderTodos(state) {
  if (!todoList) {
    return;
  }

  // Clear the previous task display.
  todoList.replaceChildren();

  // Get tasks matching the selected filter.
  const visibleTodos = getVisibleTodos(state.todos, state.currentFilter);

  // Create and display each task.
  visibleTodos.forEach((todo) => {
    const listItem = document.createElement("li");
    listItem.className = "todo-item";
    listItem.dataset.id = todo.id;

    if (todo.completed) {
      listItem.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.dataset.action = "toggle";
    checkbox.setAttribute("aria-label", `Complete ${todo.text}`);

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.dataset.action = "delete";
    deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);

    listItem.append(checkbox, todoText, deleteButton);
    todoList.appendChild(listItem);
  });

  // Update the remaining task count.
  const activeCount = state.todos.filter((todo) => !todo.completed).length;

  if (itemsLeft) {
    itemsLeft.textContent = `${activeCount} ${
      activeCount === 1 ? "item" : "items"
    } left`;
  }

  // Show the empty state when no tasks match the filter.
  if (emptyState) {
    emptyState.hidden = visibleTodos.length > 0;
  }

  // Disable the clear button when there are no completed tasks.
  if (clearCompletedButton) {
    clearCompletedButton.disabled = !state.todos.some((todo) => todo.completed);
  }

  // Highlight the currently selected filter.
  document.querySelectorAll(".filter").forEach((button) => {
    const isActive = button.dataset.filter === state.currentFilter;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}
