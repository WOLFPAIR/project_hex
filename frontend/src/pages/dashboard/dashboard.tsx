import './dashboard.css';
import { Button } from '../../components/header/button/button.tsx';
import { YoutubeIcon } from '../../components/youtube_icon/youtube_icon.tsx';
// C:\Users\wolfp\OneDrive\Desktop\project_hex\project_hex\frontend\src\components\youtube_icon\youtube_icon.tsx
export default function Dashboard() {
  return (
  <header className='header'>
        <div>
      <Button>Click</Button>
    </div> 
    <div>
      <YoutubeIcon></YoutubeIcon>
     </div>
   </header>
  );
}