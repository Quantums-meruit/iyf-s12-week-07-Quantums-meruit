import test from "node:test";
import assert from "node:assert/strict";

import {
  getVisibleTodos,
  getActiveTodoCount,
  toggleTodo,
  deleteTodo,
  addTodo,
  clearCompletedTodos,
  editTodo,
} from "../js/todo-logic.js";

const sampleTodos = [
  { id: 1, text: "Learn JavaScript", completed: false },
  { id: 2, text: "Practice Coding", completed: true },
  { id: 3, text: "Build a Project", completed: false },
];

test("getVisibleTodos returns only active tasks", () => {
  const result = getVisibleTodos(sampleTodos, "active");

  assert.equal(result.length, 2);
  assert.equal(result[0].id, 1);
});

test("getVisibleTodos returns only completed tasks", () => {
  const result = getVisibleTodos(sampleTodos, "completed");

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test("getActiveTodoCount returns the number of unfinished tasks", () => {
  assert.equal(getActiveTodoCount(sampleTodos), 2);
});

test("getActiveTodoCount handles an empty list", () => {
  assert.equal(getActiveTodoCount([]), 0);
});

test("toggleTodo changes a task's completed status", () => {
  const result = toggleTodo(sampleTodos, 1);

  assert.equal(result[0].completed, true);
});

test("toggleTodo leaves the list unchanged when the ID is missing", () => {
  const result = toggleTodo(sampleTodos, 99);

  assert.deepEqual(result, sampleTodos);
});

test("deleteTodo removes a task using its ID", () => {
  const result = deleteTodo(sampleTodos, 2);

  assert.equal(result.length, 2);
  assert.equal(result.some((todo) => todo.id === 2), false);
});

test("addTodo adds a new unfinished task and trims its text", () => {
  const result = addTodo(sampleTodos, "  Study CSS  ", 4);

  assert.equal(result.length, 4);
  assert.equal(result[3].text, "Study CSS");
  assert.equal(result[3].completed, false);
});

test("addTodo ignores empty task text", () => {
  const result = addTodo(sampleTodos, "   ", 4);

  assert.equal(result, sampleTodos);
});

test("clearCompletedTodos removes completed tasks", () => {
  const result = clearCompletedTodos(sampleTodos);

  assert.equal(result.length, 2);
  assert.equal(result.every((todo) => !todo.completed), true);
});

test("editTodo updates the text of a task", () => {
  const result = editTodo(sampleTodos, 1, "Learn CSS");

  assert.equal(result[0].text, "Learn CSS");
  assert.equal(sampleTodos[0].text, "Learn JavaScript");
});

test("editTodo ignores empty replacement text", () => {
  const result = editTodo(sampleTodos, 1, "  ");

  assert.deepEqual(result, sampleTodos);
});

test("todo functions do not mutate the original array", () => {
  const original = structuredClone(sampleTodos);

  toggleTodo(sampleTodos, 1);
  deleteTodo(sampleTodos, 2);
  addTodo(sampleTodos, "New task", 4);
  clearCompletedTodos(sampleTodos);
  editTodo(sampleTodos, 1, "New text");

  assert.deepEqual(sampleTodos, original);
});
