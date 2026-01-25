import './sidebar.css';
import { FaAngleLeft, FaBars, FaHome, FaTelegram } from 'react-icons/fa';
import { SidebarButton } from './button/button.tsx';
import { UserIcon } from './UserIcon/UserIcon.tsx';
import { Logo } from '../logo/Logo.tsx';
import { useGetMeQuery } from '../../services/authApi';

export default function Sidebar({
    isCollapsed,
    onToggle,
}: {
    isCollapsed: boolean;
    onToggle: () => void;
}) {
    const { data: me } = useGetMeQuery(undefined);
    const handleTelegramConnect = () => {
        if (!me?.id) {
            alert('Сначала нужно войти в аккаунт.');
            return;
        }

        const url = `https://t.me/Todremindersbot?start=${me.id}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`sidebar-shell${isCollapsed ? ' sidebar-shell--collapsed' : ''}`}>
            <div className="sidebar">
                <div className="sidebar-header">
                    {!isCollapsed && <Logo />}
                    <button
                        className="sidebar-toggle"
                        type="button"
                        onClick={onToggle}
                        aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
                    >
                        {isCollapsed ? <FaBars /> : <FaAngleLeft />}
                    </button>
                </div>
                
                <div className="sidebar-section sidebar-section--main">
                    <div className="sidebar-buttons">
                        <SidebarButton icon={<FaHome />} label="Home" to="/dashboard" />
                        <SidebarButton 
                            icon={<FaTelegram />} 
                            label="Connect Telegram" 
                            onClick={handleTelegramConnect} 
                        />
                    </div>
                </div>

                <div className="sidebar-section sidebar-footer">
                    <UserIcon name={me?.username ?? 'User'} />
                </div>
            </div>
        </div>
    );
}