const TODOS_KEY = "todos";
const FILTER_KEY = "todoFilter";

// Saves tasks in localStorage.
export function saveTodos(todos) {
  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    return true;
  } catch {
    return false;
  }
}

// Retrieves saved tasks from localStorage.
export function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(TODOS_KEY);

    if (!savedTodos) {
      return [];
    }

    const todos = JSON.parse(savedTodos);

    return Array.isArray(todos) ? todos : [];
  } catch {
    return [];
  }
}

// Saves the selected filter.
export function saveFilter(filter) {
  try {
    localStorage.setItem(FILTER_KEY, filter);
    return true;
  } catch {
    return false;
  }
}

// Retrieves the saved filter.
export function loadFilter() {
  try {
    const savedFilter = localStorage.getItem(FILTER_KEY);
    const validFilters = ["all", "active", "completed"];

    return validFilters.includes(savedFilter) ? savedFilter : "all";
  } catch {
    return "all";
  }
}
