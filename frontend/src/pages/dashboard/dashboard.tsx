import './dashboard.css';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar.tsx';
import { Todo } from '../../components/to-dos/todo.tsx';
import { useState } from 'react';
import type { TodoType } from '../../types/todo';
import { Header } from '../../components/header/header.tsx';
import { TodoModal } from '../../components/todo-modal/todo-modal.tsx';
import { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDeleteTasksMutation
} from '../../services/tasksApi';

export default function Dashboard() {

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteTasks] = useDeleteTasksMutation();

  // Состояние для управления видимостью модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const { data: todos = [], isLoading, isFetching } = useGetTasksQuery(undefined, {
    pollingInterval: 60000, // refresh every 60s to pick up reminder status changes
  });

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

  // Функция для удаления конкретной задачи
  const handleDeleteTask = async (todoId: string) => {
    try {
      await deleteTask(todoId).unwrap();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Функция для удаления всех выполненных задач
  const handleClearCompleted = async () => {
    const completedIds = completedTodos.map(todo => Number(todo.id));
    if (completedIds.length === 0) return;
    
    if (window.confirm(`Вы уверены, что хотите удалить все выполненные задачи (${completedIds.length})?`)) {
      try {
        await deleteTasks(completedIds).unwrap();
      } catch (error) {
        console.error('Failed to delete completed tasks:', error);
      }
    }
  };

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="dashboard-layout">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className={`dashboard-main${isSidebarCollapsed ? ' dashboard-main--collapsed' : ''}`}>
        <Header title="Dashboard" onAddTodo={handleOpenModal} />

        <main className="dashboard-content">
          <Outlet />
          {isFetching && !isLoading && (
            <div className="polling-indicator">🔄 Обновление...</div>
          )}
          {isLoading ? (
            <div className="todo-loading">Загружаем задачи...</div>
          ) : (
            <div className="todo-board">
              <section className="todo-column">
                <div className="todo-column-header">
                  <div className="todo-column-title">
                    <h2>В процессе</h2>
                    <span className="todo-count">{pendingTodos.length}</span>
                  </div>
                  <p>Фокус на актуальные задачи</p>
                </div>
                <div className="todo-list">
                  {pendingTodos.length === 0 ? (
                    <div className="todo-empty">Задач пока нет</div>
                  ) : (
                    pendingTodos.map((todo, index) => (
                      <Todo
                        key={todo.id}
                        id={todo.id}
                        title={todo.title}
                        completed={todo.completed}
                        remainded={todo.remainded}
                        description={todo.description}
                        reminder_time={todo.reminder_time}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        animationDelay={index * 45}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="todo-column todo-column-completed">
                <div className="todo-column-header">
                  <div className="todo-column-header-top">
                    <div className="todo-column-title">
                      <h2>Готово</h2>
                      <span className="todo-count">{completedTodos.length}</span>
                    </div>
                    {completedTodos.length > 0 && (
                      <button 
                        onClick={handleClearCompleted} 
                        className="clear-completed-btn"
                        title="Удалить все выполненные задачи"
                      >
                        Очистить все
                      </button>
                    )}
                  </div>
                  <p>Выполненные задачи</p>
                </div>
                <div className="todo-list">
                  {completedTodos.length === 0 ? (
                    <div className="todo-empty">Пока нет завершенных</div>
                  ) : (
                    completedTodos.map((todo, index) => (
                      <Todo
                        key={todo.id}
                        id={todo.id}
                        title={todo.title}
                        completed={todo.completed}
                        remainded={todo.remainded}
                        description={todo.description}
                        reminder_time={todo.reminder_time}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        animationDelay={index * 45}
                      />
                    ))
                  )}
                </div>
              </section>
            </div>
          )}
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