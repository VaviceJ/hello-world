import {
  addTodo,
  isTodoFilter,
  parseStoredTodos,
  parseTodoId,
  Todo,
  TodoFilter,
  toggleTodo,
} from "./todo";

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Todo 页面缺少必要元素：${selector}`);
  }
  return element;
}

const form = requireElement<HTMLFormElement>("#todo-form");
const input = requireElement<HTMLInputElement>("#todo-input");
const list = requireElement<HTMLUListElement>("#todo-list");
const countHint = requireElement<HTMLElement>("#count-hint");
const clearCompletedButton = requireElement<HTMLButtonElement>("#clear-completed");
const filterButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-filter]"),
);

const STORAGE_KEY = "w8-todos";
let todos: Todo[] = parseStoredTodos(window.localStorage.getItem(STORAGE_KEY));
let currentFilter: TodoFilter = "all";

function save(): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function visibleTodos(): Todo[] {
  return todos.filter((todo) => {
    if (currentFilter === "done") return todo.completed;
    if (currentFilter === "active") return !todo.completed;
    return true;
  });
}

function render(): void {
  list.replaceChildren();
  const shown = visibleTodos();
  countHint.textContent = `共 ${todos.length} 项，当前显示 ${shown.length} 项`;

  if (shown.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "当前筛选下没有 Todo";
    list.appendChild(empty);
  }

  for (const todo of shown) {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " is-done" : ""}`;
    item.dataset.id = String(todo.id);

    const text = document.createElement("span");
    text.className = `todo-text${todo.completed ? " is-done" : ""}`;
    text.textContent = todo.text;

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.dataset.action = "edit";
    editButton.type = "button";
    editButton.textContent = "编辑";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";
    deleteButton.type = "button";
    deleteButton.textContent = "删除";

    item.append(text, editButton, deleteButton);
    list.appendChild(item);
  }

  for (const button of filterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === currentFilter));
  }
}

function deleteTodo(id: number): void {
  todos = todos.filter((todo) => todo.id !== id);
  save();
  render();
}

function editTodo(id: number): void {
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;

  const nextText = window.prompt("请输入新的 Todo 内容：", todo.text);
  if (nextText === null) return;
  const cleanText = nextText.trim();
  if (cleanText.length === 0) return;

  todos = todos.map((item) => (
    item.id === id ? { ...item, text: cleanText } : item
  ));
  save();
  render();
}

function setFilter(value: string | undefined): void {
  if (!isTodoFilter(value)) return;
  currentFilter = value;
  render();
}

function clearCompleted(): void {
  todos = todos.filter((todo) => !todo.completed);
  save();
  render();
}

form.addEventListener("submit", (event: SubmitEvent): void => {
  event.preventDefault();
  todos = addTodo(todos, input.value);
  save();
  render();
  input.value = "";
  input.focus();
});

list.addEventListener("click", (event: MouseEvent): void => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const item = target.closest<HTMLLIElement>("li.todo-item");
  if (!item || !list.contains(item)) return;

  const id = parseTodoId(item.dataset.id);
  if (id === null) return;

  const actionButton = target.closest<HTMLButtonElement>("button[data-action]");
  if (actionButton && item.contains(actionButton)) {
    if (actionButton.dataset.action === "delete") {
      deleteTodo(id);
      return;
    }
    if (actionButton.dataset.action === "edit") {
      editTodo(id);
      return;
    }
  }

  todos = toggleTodo(todos, id);
  save();
  render();
});

for (const button of filterButtons) {
  button.addEventListener("click", (): void => setFilter(button.dataset.filter));
}

clearCompletedButton.addEventListener("click", clearCompleted);
render();
