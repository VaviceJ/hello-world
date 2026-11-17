import { describe, expect, it } from "vitest";
import {
  addTodo,
  isTodo,
  parseStoredTodos,
  parseTodoId,
  Todo,
  toggleTodo,
} from "./todo";

describe("addTodo", () => {
  it("adds a valid task and stores its trimmed text", () => {
    const todos: Todo[] = [];
    const result = addTodo(todos, "  学习 TypeScript  ", 101);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 101, text: "学习 TypeScript", completed: false });
    expect(todos).toHaveLength(0);
  });

  it("rejects text that contains only spaces", () => {
    expect(addTodo([], "   ", 102)).toEqual([]);
  });

  it("rejects an empty string", () => {
    expect(addTodo([], "", 103)).toEqual([]);
  });

  it("rejects null and other non-string input at the runtime boundary", () => {
    expect(addTodo([], null, 104)).toEqual([]);
    expect(addTodo([], 123, 105)).toEqual([]);
  });

  it("allows duplicate task text because duplicates are not prohibited by the contract", () => {
    const first = addTodo([], "复习", 106);
    expect(addTodo(first, "复习", 107)).toEqual([
      { id: 106, text: "复习", completed: false },
      { id: 107, text: "复习", completed: false },
    ]);
  });

  it("keeps long text intact because the UI has no maximum-length rule", () => {
    const longText = "长".repeat(2_000);
    expect(addTodo([], longText, 108)[0].text).toBe(longText);
  });

  it("rejects invalid IDs", () => {
    expect(addTodo([], "有效文字", 0)).toEqual([]);
    expect(addTodo([], "有效文字", Number.MAX_SAFE_INTEGER + 1)).toEqual([]);
  });
});

describe("toggleTodo", () => {
  it("flips only the matching task", () => {
    const todos: Todo[] = [
      { id: 201, text: "目标任务", completed: false },
      { id: 202, text: "其他任务", completed: false },
    ];

    expect(toggleTodo(todos, 201)).toEqual([
      { id: 201, text: "目标任务", completed: true },
      { id: 202, text: "其他任务", completed: false },
    ]);
  });

  it("does not throw or alter tasks when the ID is missing", () => {
    const todos: Todo[] = [{ id: 203, text: "已有任务", completed: false }];
    expect(toggleTodo(todos, 999)).toEqual(todos);
  });
});

describe("dataset IDs and stored data", () => {
  it("converts valid dataset ID strings to safe positive integers", () => {
    expect(parseTodoId("204")).toBe(204);
  });

  it("rejects malformed or unsafe dataset IDs", () => {
    const invalidIds = [undefined, "", "   ", "12abc", "1.5", "0", "-2", "9007199254740992"];
    for (const rawId of invalidIds) {
      expect(parseTodoId(rawId)).toBeNull();
    }
  });

  it("filters malformed stored rows and returns an empty list for invalid JSON", () => {
    const valid = { id: 205, text: "保留", completed: false };
    const malformed = { id: "206", text: "丢弃", completed: false };

    expect(parseStoredTodos(JSON.stringify([valid, malformed, null]))).toEqual([valid]);
    expect(parseStoredTodos("{" )).toEqual([]);
    expect(parseStoredTodos(null)).toEqual([]);
  });

  it("rejects invalid persisted IDs and fields", () => {
    for (const id of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1, "207"]) {
      expect(isTodo({ id, text: "任务", completed: false })).toBe(false);
    }
    expect(isTodo({ id: 207, text: 12, completed: false })).toBe(false);
    expect(isTodo({ id: 207, text: "任务", completed: "no" })).toBe(false);
    expect(isTodo({ id: 207, text: "任务" })).toBe(false);
    expect(isTodo([])).toBe(false);
  });

  it("validates the persisted Todo shape", () => {
    expect(isTodo({ id: 207, text: "合法", completed: true })).toBe(true);
    expect(isTodo({ id: 1.5, text: "错误 ID", completed: false })).toBe(false);
  });
});
