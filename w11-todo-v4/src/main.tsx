import React from 'react';
import { createRoot } from 'react-dom/client';
import { TodoApp } from './components/TodoApp';

const root = document.getElementById('root');
if (!root) throw new Error('缺少根节点');
createRoot(root).render(<React.StrictMode><TodoApp /></React.StrictMode>);
