// Returns tasks according to the selected filter.
export function getVisibleTodos(todos, filter) {
  if (filter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (filter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// Returns the number of tasks that are not completed.
export function getActiveTodoCount(todos) {
  return todos.filter((todo) => !todo.completed).length;
}

// Toggles the completed status of a task.
export function toggleTodo(todos, id) {
  return todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }

    return todo;
  });
}

// Removes a task using its ID.
export function deleteTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

// Adds a new task to the list.
export function addTodo(todos, text, id) {
  const cleanText = text.trim();

  if (!cleanText) {
    return todos;
  }

  const newTodo = {
    id,
    text: cleanText,
    completed: false,
  };

  return [...todos, newTodo];
}

// Removes all completed tasks.
export function clearCompletedTodos(todos) {
  return todos.filter((todo) => !todo.completed);
}

// Updates the text of a task using its ID.
export function editTodo(todos, id, newText) {
  const cleanText = newText.trim();

  if (!cleanText) {
    return todos;
  }

  return todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: cleanText };
    }

    return todo;
  });
}
