import { useState, type FormEvent } from 'react';

interface TodoFormProps { onAdd: (text: string) => void }
export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText('');
  }
  return <form className="todo-form" onSubmit={submit}>
    <label htmlFor="todo-input">Todo 内容<input id="todo-input" value={text} onChange={e => setText(e.target.value)} placeholder="例如：完成实验报告" autoComplete="off" /></label>
    <button type="submit">添加 Todo</button>
  </form>;
}
