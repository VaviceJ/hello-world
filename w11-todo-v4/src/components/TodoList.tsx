import type { Todo } from '../todo';
import { TodoItem } from './TodoItem';
export interface TodoListProps { todos: Todo[]; onToggle: (id: number) => void; onDelete: (id: number) => void; onEdit: (id: number) => void }
export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  return <ul className="todo-list" aria-live="polite">{todos.length === 0 ? <li className="empty">当前筛选下没有 Todo</li> : todos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />)}</ul>;
}
