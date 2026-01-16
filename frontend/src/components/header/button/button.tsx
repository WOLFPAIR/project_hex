import './button.css';
import side_bar_icon from '../../../assets/sidebar-left-svgrepo-com.svg'
export function Button() {
  return (
    <button className='button_for_h'><img src={side_bar_icon} className='for_img_but'/></button>
  );
}