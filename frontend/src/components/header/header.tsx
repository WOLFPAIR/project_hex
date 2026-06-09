import './header.css';

import { YoutubeIcon } from '../youtube_icon/youtube_icon.tsx';
import { New_button } from "./new_button/new_button.tsx";

interface HeaderProps {
    title?: string;
    onAddTodo?: () => void;
}

export function Header({ title = 'Dashboard', onAddTodo }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-left">
               <New_button onAddTodo={onAddTodo} />
            </div>
            <div className="header-center">
                <h1>{title}</h1>
            </div>
            <div className="header-right">
                <YoutubeIcon />
            </div>
        </header>
    );
}
