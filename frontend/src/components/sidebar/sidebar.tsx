import './sidebar.css';
import { FaHome, FaTelegram } from 'react-icons/fa';
import { SidebarButton } from './button/button.tsx';
import { UserIcon } from './UserIcon/UserIcon.tsx';
import { Logo } from '../logo/logo.tsx';

export default function Sidebar() {
    const handleTelegramConnect = () => {
        // TODO: Implement actual Telegram connection logic
        // This would typically involve redirecting to a Telegram bot with a start parameter
        // e.g., window.open('https://t.me/YourBot?start=' + userId, '_blank');
        alert("Connect Telegram functionality to be implemented. Backend support added.");
    };

    return (
        <div>
            <div className="sidebar">
                <div className="sidebar-header">
                    <Logo />
                </div>
                
                <div className="sidebar-buttons">
                    <SidebarButton icon={<FaHome />} label="Home" to="/dashboard" />
                    <SidebarButton 
                        icon={<FaTelegram />} 
                        label="Connect Telegram" 
                        onClick={handleTelegramConnect} 
                    />
                </div>

                <div className="sidebar-footer">
                    <UserIcon name="John Doe" />
                </div>
            </div>
        </div>
    );
}