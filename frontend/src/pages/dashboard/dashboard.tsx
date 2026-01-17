import './dashboard.css';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar.tsx';
import { Todo } from '../../components/to-dos/todo.tsx';
import { useState } from 'react';
import type { TodoType } from '../../types/todo';
import { Header } from '../../components/header/header.tsx';
import { TodoModal } from '../../components/todo-modal/todo-modal.tsx';

export default function Dashboard() {
  const [todos, setTodos] = useState<TodoType[]>([
    { id: '1', title: 'Todo 1', completed: false, description: 'Description 1' }
  ]);
  
  // Состояние для управления видимостью модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для открытия модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Функция для сохранения новой todo
  const handleSaveTodo = (newTodo: TodoType) => {
    setTodos([...todos, newTodo]);
  };

  // Функция для изменения статуса задачи (завершена/не завершена)
  const handleToggleComplete = (todoId: string) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, completed: !todo.completed } // Меняем статус на противоположный
        : todo // Остальные задачи оставляем без изменений
    ));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header title="Dashboard" onAddTodo={handleOpenModal} />
        
        <main className="dashboard-content">
          <Outlet />
          <div className="todo-list">
            {todos.map((todo) => (
              <Todo 
                key={todo.id} 
                id={todo.id}
                title={todo.title} 
                completed={todo.completed} 
                description={todo.description}
                onToggleComplete={handleToggleComplete}
              />
            ))}
            
          </div>
        </main>
      </div>
      
      {/* Модальное окно для создания новой задачи */}
      <TodoModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTodo}
      />
    </div>
  );
} 