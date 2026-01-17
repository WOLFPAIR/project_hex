import './new_button.css';

interface NewButtonProps {
    onAddTodo?: () => void;
}

export function New_button({ onAddTodo }: NewButtonProps) {
    const handleClick = () => {
        if (onAddTodo) {
            onAddTodo();
        }
    };

    return(
        <button className="new_baton" onClick={handleClick}>
            Создать новую задачу
        </button>
    );
}