import './dashboard.css';
import { Button } from '../../components/button/button.tsx';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar.tsx';
import { Todo } from '../../components/to-dos/todo.tsx';
import { useState } from 'react';
import type { TodoType } from '../../types/todo';
export default function Dashboard() {
  const [todos, setTodos] = useState<TodoType[]>([{ title: 'Todo 1', completed: false, description: 'Description 1' }]);
  return (
    <div>
      <Sidebar />
      <Outlet />
      <h1>Dashboard</h1>
       {/* {todos.map((todo) => (
        <Todo key={todo.id} title={todo.title} description={todo.description} completed={todo.completed} />
       ))} */}
       {todos.map((todo) => (
        <Todo key={todo.title} title={todo.title} completed={todo.completed} description={todo.description} />
       ))}
    </div>
  );
} 