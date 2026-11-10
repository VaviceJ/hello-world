import type { Todo } from '../todo';
export interface TodoItemProps { todo: Todo; onToggle: (id: number) => void; onDelete: (id: number) => void; onEdit: (id: number) => void }
export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  return <li className={`todo-item${todo.completed ? ' is-done' : ''}`}>
    <span className={`todo-text${todo.completed ? ' is-done' : ''}`}>{todo.text}</span>
    <button type="button" onClick={() => onToggle(todo.id)}>{todo.completed ? '取消完成' : '完成'}</button>
    <button type="button" className="edit-button" onClick={() => onEdit(todo.id)}>编辑</button>
    <button type="button" className="delete-button" onClick={() => onDelete(todo.id)}>删除</button>
  </li>;
}
