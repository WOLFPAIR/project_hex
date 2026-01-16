import type {IconType} from 'react-icons';
import { useNavigate } from 'react-router-dom';
import './button.css';
import { ReactNode } from 'react';

export function SidebarButton({ icon, label, to }: { icon: ReactNode, label: string, to: string }) {
    const navigate = useNavigate();
    return (
        <button className="sidebar-button" onClick={() => navigate(to)}>
            <div className='sidebar-icon'>{icon}</div>
            <span>{label}</span>
        </button>
    );
}