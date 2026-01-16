import './todo.css';
import type { TodoType } from '../../types/todo';

export function Todo({ title, completed, description }: TodoType) {
    return (
        <div className="todo">
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{completed ? 'Completed' : 'Not Completed'}</p>
        </div>
    );
}