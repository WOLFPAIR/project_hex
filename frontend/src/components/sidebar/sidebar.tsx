import './sidebar.css';
import {useNavigate} from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { SidebarButton } from './button/button.tsx';
import { UserIcon } from './UserIcon/UserIcon.tsx';
import {Logo} from '../logo/logo.tsx'
export default function Sidebar() {
    return (
        <div>
            <div className="sidebar">
                <div className="sidebar-">
                 <Logo/>
                 <SidebarButton icon={<FaHome />} label="Home" to="/dashboard" />
                 <SidebarButton icon={<FaHome />} label="Home" to="/dashboard" />
                 <SidebarButton icon={<FaHome />} label="Home" to="/dashboard" />
                </div>
                <div className="sidebar-user-icon">
                    <UserIcon name="John Doe" />
                </div>
            </div>
        </div>
    );
}