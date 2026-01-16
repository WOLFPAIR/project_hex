import './header.css';
import { Button } from './button/button.tsx';
import { YoutubeIcon } from '../youtube_icon/youtube_icon.tsx';

interface HeaderProps {
    title?: string;
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-left">
                <Button>Click</Button>
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
