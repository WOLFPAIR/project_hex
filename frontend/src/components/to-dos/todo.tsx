import './todo.css';
import type { TodoType } from '../../types/todo';

interface TodoProps extends TodoType {
    onToggleComplete: (id: string) => void;
}

export function Todo({ id, title, completed, description, color, onToggleComplete }: TodoProps) {
    const handleCheckboxChange = () => {
        onToggleComplete(id);
    };

    return (
        <div 
            className={`todo ${completed ? 'todo-completed' : ''}`} 
            style={{ backgroundColor: color }}
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
            <div className="todo-status">
                <span className={`status-badge ${completed ? 'status-completed' : 'status-pending'}`}>
                    {completed ? '✓ Выполнено' : '○ В процессе'}
                </span>
            </div>
        </div>
    );
}