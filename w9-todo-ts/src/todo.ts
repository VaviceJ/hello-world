export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export type TodoFilter = "all" | "active" | "done";

export function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  if (!("id" in value) || !("text" in value) || !("completed" in value)) {
    return false;
  }

  const { id, text, completed } = value;
  return typeof id === "number"
    && Number.isSafeInteger(id)
    && id > 0
    && typeof text === "string"
    && typeof completed === "boolean";
}

export function addTodo(
  todos: readonly Todo[],
  text: unknown,
  id: number = Date.now(),
): Todo[] {
  if (typeof text !== "string" || !Number.isSafeInteger(id) || id <= 0) {
    return [...todos];
  }

  const cleanText = text.trim();
  if (cleanText.length === 0) {
    return [...todos];
  }

  return [...todos, { id, text: cleanText, completed: false }];
}

export function toggleTodo(todos: readonly Todo[], id: number): Todo[] {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return [...todos];
  }

  return todos.map((todo) => (
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
}

export function parseTodoId(rawId: string | undefined): number | null {
  if (rawId === undefined || rawId.trim().length === 0) {
    return null;
  }

  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function parseStoredTodos(raw: string | null): Todo[] {
  if (raw === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item: unknown): item is Todo => isTodo(item));
  } catch {
    return [];
  }
}

export function isTodoFilter(value: string | undefined): value is TodoFilter {
  return value === "all" || value === "active" || value === "done";
}
