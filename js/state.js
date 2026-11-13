import { loadTodos, saveTodos, loadFilter, saveFilter } from "./storage.js";

// Central application state.
let state = {
  todos: loadTodos(),
  currentFilter: loadFilter(),
};

// Observers that need to know when state changes.
const listeners = [];

// Returns the current state.
export function getState() {
  return state;
}

// Notifies all registered listeners.
function notify() {
  listeners.forEach((listener) => listener(state));
}

// Registers a listener.
export function subscribe(listener) {
  listeners.push(listener);
}

// Updates the task list.
export function updateTodos(todos) {
  state = {
    ...state,
    todos,
  };

  saveTodos(todos);
  notify();
}

// Updates the selected filter.
export function updateFilter(filter) {
  state = {
    ...state,
    currentFilter: filter,
  };

  saveFilter(filter);
  notify();
}
