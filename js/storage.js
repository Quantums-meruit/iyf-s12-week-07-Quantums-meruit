const TODOS_KEY = "todos";
const FILTER_KEY = "todoFilter";

// Saves tasks in localStorage.
export function saveTodos(todos) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

// Retrieves saved tasks from localStorage.
export function loadTodos() {
  const savedTodos = localStorage.getItem(TODOS_KEY);

  if (!savedTodos) {
    return [];
  }

  try {
    const todos = JSON.parse(savedTodos);

    return Array.isArray(todos) ? todos : [];
  } catch {
    return [];
  }
}

// Saves the selected filter.
export function saveFilter(filter) {
  localStorage.setItem(FILTER_KEY, filter);
}

// Retrieves the saved filter.
export function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_KEY);

  const validFilters = ["all", "active", "completed"];

  return validFilters.includes(savedFilter) ? savedFilter : "all";
}
