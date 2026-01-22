import './dashboard.css';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar.tsx';
import { Todo } from '../../components/to-dos/todo.tsx';
import { useState } from 'react';
import type { TodoType } from '../../types/todo';
import { Header } from '../../components/header/header.tsx';
import { TodoModal } from '../../components/todo-modal/todo-modal.tsx';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation } from '../../services/tasksApi';

export default function Dashboard() {
  const { data: todos = [], isLoading } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  
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
  const handleSaveTodo = async (newTodo: TodoType) => {
    try {
        await createTask({
            title: newTodo.title,
            description: newTodo.description,
            completed: newTodo.completed,
            reminder_time: newTodo.reminder_time
        }).unwrap();
    } catch (error) {
        console.error('Failed to create task:', error);
    }
  };

  // Функция для изменения статуса задачи (завершена/не завершена)
  const handleToggleComplete = async (todoId: string) => {
    const todo = todos.find(t => t.id.toString() === todoId.toString());
    if (todo) {
        try {
            await updateTask({
                id: todoId,
                task: {
                    title: todo.title,
                    description: todo.description,
                    completed: !todo.completed,
                    reminder_time: todo.reminder_time
                }
            }).unwrap();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header title="Dashboard" onAddTodo={handleOpenModal} />
        
        <main className="dashboard-content">
          <Outlet />
          <div className="todo-list">
            {isLoading ? (
                <div>Loading tasks...</div>
            ) : (
                todos.map((todo) => (
                <Todo 
                    key={todo.id} 
                    id={todo.id}
                    title={todo.title} 
                    completed={todo.completed} 
                    description={todo.description}
                    reminder_time={todo.reminder_time}
                    onToggleComplete={handleToggleComplete}
                />
                ))
            )}
            
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