import './todo-modal.css';
import type { TodoType } from '../../types/todo';
import { useState, useEffect } from 'react';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: TodoType) => void;
}

export function TodoModal({ isOpen, onClose, onSave }: TodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Очищаем форму когда модальное окно закрывается
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  // Если модальное окно закрыто, не показываем его
  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    
    // Проверяем, что заголовок не пустой
    if (title.trim() === '') {
      alert('Пожалуйста, введите заголовок задачи');
      return;
    }

    // Создаем новую todo с уникальным id
    const newTodo: TodoType = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Уникальный id
      title: title.trim(),
      description: description.trim(),
      completed: false
    };

    // Сохраняем и закрываем окно
    onSave(newTodo);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Создать новую задачу</h2>
          <button className="modal-close" onClick={handleCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Заголовок задачи:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание задачи..."
              rows={4}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Отмена
            </button>
            <button type="submit" className="btn-save">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
