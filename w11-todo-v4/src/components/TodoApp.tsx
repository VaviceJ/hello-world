import { useEffect, useState } from 'react';
import { addTodo, parseStoredTodos, toggleTodo, type Todo, type TodoFilter } from '../todo';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

const STORAGE_KEY = 'w8-todos';
export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => parseStoredTodos(localStorage.getItem(STORAGE_KEY)));
  const [filter, setFilter] = useState<TodoFilter>('all');
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }, [todos]);
  function handleAdd(text: string) {
    setTodos(previous => addTodo(previous, text, Math.max(Date.now(), ...previous.map(t => t.id + 1))));
  }
  function handleToggle(id: number) { setTodos(previous => toggleTodo(previous, id)); }
  function handleDelete(id: number) { setTodos(previous => previous.filter(todo => todo.id !== id)); }
  function handleEdit(id: number) {
    const todo = todos.find(item => item.id === id);
    if (!todo) return;
    const next = window.prompt('请输入新的 Todo 内容：', todo.text);
    if (!next?.trim()) return;
    setTodos(previous => previous.map(item => item.id === id ? { ...item, text: next.trim() } : item));
  }
  const shown = todos.filter(todo => filter === 'all' || (filter === 'done' ? todo.completed : !todo.completed));
  return <main className="app-shell"><h1>Todo 列表 V4.0</h1>
    <p className="intro">React 状态驱动的待办事项</p>
    <TodoForm onAdd={handleAdd} />
    <div className="filters" aria-label="Todo 筛选">
      {([['all', '全部'], ['active', '未完成'], ['done', '已完成']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
      <button type="button" onClick={() => setTodos(previous => previous.filter(todo => !todo.completed))}>清除已完成</button>
    </div>
    <section aria-labelledby="list-title"><div className="list-heading"><h2 id="list-title">我的 Todo</h2><span className="hint">共 {todos.length} 项，当前显示 {shown.length} 项</span></div>
      <TodoList todos={shown} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
    </section>
  </main>;
}
