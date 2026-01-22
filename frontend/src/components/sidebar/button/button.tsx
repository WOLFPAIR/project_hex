import type {IconType} from 'react-icons';
import { useNavigate } from 'react-router-dom';
import './button.css';
import { ReactNode } from 'react';

export function SidebarButton({ icon, label, to, onClick }: { icon: ReactNode, label: string, to?: string, onClick?: () => void }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        }
    };

    return (
        <button className="sidebar-button" onClick={handleClick}>
            <div className='sidebar-icon'>{icon}</div>
            <span>{label}</span>
        </button>
    );
}