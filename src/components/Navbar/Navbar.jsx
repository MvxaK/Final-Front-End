import React from "react";
import { Link } from "react-router-dom";
import s from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={s.nav}>
      <div className={s.menu}>
        <div className={`${s.item} ${s.active}`}>
          <Link to="/">Profile</Link>
        </div>
        <div className={s.item}>
          <Link to="/dialogs">Dialogs</Link>
        </div>
        <div className={s.item}>
          <Link to="/main">Main</Link>
        </div>
        <div className={s.item}>
          <Link to="/users">Users</Link>
        </div>
        <div className={s.item}>
          <Link to="/about">About us</Link>
        </div>
      </div>

      <div className={s.icon}>
        <Link to="/">
          <img 
            src="https://play-lh.googleusercontent.com/DTzWtkxfnKwFO3ruybY1SKjJQnLYeuK3KmQmwV5OQ3dULr5iXxeEtzBLceultrKTIUTr" 
            alt="Logo"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
