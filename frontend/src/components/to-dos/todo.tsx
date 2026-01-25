import './todo.css';
import type { TodoType } from '../../types/todo';

interface TodoProps extends TodoType {
    onToggleComplete: (id: string) => void;
    animationDelay?: number;
}

export function Todo({ id, title, completed, description, reminder_time, onToggleComplete, animationDelay }: TodoProps) {
    const handleCheckboxChange = () => {
        onToggleComplete(id);
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
            </div>
            <p className={completed ? 'todo-description-completed' : ''}>{description}</p>
            {reminder_time && (
                <div className="todo-reminder">
                    ⏰ {formatReminder(reminder_time)}
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