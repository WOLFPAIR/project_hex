import './sidebar.css';
import {useNavigate} from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { SidebarButton } from '../../components/sidebar/button/button';
import { UserIcon } from '../../components/sidebar/UserIcon/UserIcon';
export default function Sidebar() {
    return (
        <div>
            <div className="sidebar">
                <div className="sidebar-">
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