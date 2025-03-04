import React from 'react';
import s from './Navbar.module.css';

const Navbar = () => {
  return (
    <div className={s.nav}>
      <div className={s.menu}>
        <div className={`${s.item} ${s.active}`}>
          <a href="#">Profile</a></div>
        <div className={s.item}>
          <a href="#">Dialogs</a></div>
        <div className={s.item}>
          <a href="#">Main</a></div>
        <div className={s.item}>
          <a href="#">Users</a></div>
        <div className={s.item}>
          <a href="#">About us</a></div>
      </div>

      <div className={s.icon}>
        <a href="#">
          <img 
            src="https://play-lh.googleusercontent.com/DTzWtkxfnKwFO3ruybY1SKjJQnLYeuK3KmQmwV5OQ3dULr5iXxeEtzBLceultrKTIUTr" 
          />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
