import { useNavigate } from 'react-router-dom';
import './button.css';
import type { ReactNode } from 'react';

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
            {icon}
            <span className="sidebar-label">{label}</span>
        </button>
    );
}