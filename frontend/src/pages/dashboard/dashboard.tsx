import './dashboard.css';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar.tsx';
import { Todo } from '../../components/to-dos/todo.tsx';
import { useState } from 'react';
import type { TodoType } from '../../types/todo';
import { Header } from '../../components/header/header.tsx';

export default function Dashboard() {
  const [todos, setTodos] = useState<TodoType[]>([
    { title: 'Todo 1', completed: false, description: 'Description 1' }
  ]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header title="Dashboard" />
        
        <main className="dashboard-content">
          <Outlet />
          <div className="todo-list">
            {todos.map((todo) => (
              <Todo 
                key={todo.title} 
                title={todo.title} 
                completed={todo.completed} 
                description={todo.description} 
              />
            ))}
            
          </div>
        </main>
      </div>
    </div>
  );
} 