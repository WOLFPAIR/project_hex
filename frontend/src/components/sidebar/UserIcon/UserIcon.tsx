import './UserIcon.css';
import { FaUser } from 'react-icons/fa';

export function UserIcon({ name }: { name: string }) {
    return (
        <div className="sidebar-user-icon">
        <div className="user-icon">
            <FaUser />
        
        </div>
          <span>{name}</span>
        </div>
    );
}