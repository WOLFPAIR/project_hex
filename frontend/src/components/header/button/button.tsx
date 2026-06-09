import './button.css';
import side_bar_icon from '../../../assets/sidebar-left-svgrepo-com.svg'
import type { ReactNode } from 'react';

export function Button({ children }: { children?: ReactNode }) {
  return (
    <button className='button_for_h'>
      <img src={side_bar_icon} className='for_img_but' alt="sidebar toggle"/>
      {children}
    </button>
  );
}