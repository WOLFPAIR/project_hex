import './todo.css';
import type { TodoType } from '../../types/todo';
import { FaTrash } from 'react-icons/fa';

interface TodoProps extends Omit<TodoType, 'id'> {
    id: string | number;
    onToggleComplete: (id: string) => void;
    onDelete?: (id: string) => void;
    animationDelay?: number;
}

export function Todo({ id, title, completed, remainded, description, reminder_time, onToggleComplete, onDelete, animationDelay }: TodoProps) {
    const handleCheckboxChange = () => {
        onToggleComplete(id.toString());
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(id.toString());
        }
    };

    const formatReminder = (isoString?: string) => {
        if (!isoString) return null;
        return new Date(isoString).toLocaleString('ru-RU', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div
            className={`todo ${completed ? 'todo-completed' : ''}`}
            style={animationDelay ? { animationDelay: `${animationDelay}ms` } : undefined}
        >
            <div className="todo-header">
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={handleCheckboxChange}
                    className="todo-checkbox"
                    id={`todo-${id}`}
                />
                <label htmlFor={`todo-${id}`} className="todo-checkbox-label">
                    <h1 className={completed ? 'todo-title-completed' : ''}>{title}</h1>
                </label>
                <button 
                    onClick={handleDeleteClick}
                    className="todo-delete-btn"
                    title="Удалить задачу"
                    aria-label="Удалить задачу"
                >
                    <FaTrash />
                </button>
            </div>
            <p className={completed ? 'todo-description-completed' : ''}>{description}</p>
            {reminder_time && (
                <div className={`todo-reminder ${remainded ? 'todo-reminder--sent' : ''}`}>
                    {remainded ? '✅' : '⏰'} {formatReminder(reminder_time)}
                    {remainded && <span className="todo-reminder-label"> · напомнено</span>}
                </div>
            )}
            <div className="todo-status">
                <span className={`status-badge ${completed ? 'status-completed' : 'status-pending'}`}>
                    {completed ? '✓ Выполнено' : '○ В процессе'}
                </span>
            </div>
        </div>
    );
}