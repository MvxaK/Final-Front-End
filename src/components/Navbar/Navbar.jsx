import React from "react";
import { Link, useLocation } from "react-router-dom";
import s from "./Navbar.module.css";
import { getAuth } from "firebase/auth";

const Navbar = () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const location = useLocation();

  // Текущий путь
  const currentPath = location.pathname;

  return (
    <div className={s.nav}>
      <div className={s.menu}>
        <div className={`${s.item} ${currentPath === `/profile/${userId}` ? s.active : ""}`}>
          <Link to={`/profile/${userId}`}>Profile</Link>
        </div>
        <div className={`${s.item} ${currentPath === "/" ? s.active : ""}`}>
          <Link to="/">Main</Link>
        </div>
        <div className={`${s.item} ${currentPath === "/users" ? s.active : ""}`}>
          <Link to="/users">Users</Link>
        </div>
        <div className={`${s.item} ${currentPath === "/about" ? s.active : ""}`}>
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
