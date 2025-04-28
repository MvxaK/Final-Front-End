import React from 'react';
import s from './UserCard.module.css';
import {Link} from 'react-router-dom';

const UserCard = ({ avatar, name, description }) => {
  return (
    <div className={s.card}>
      <Link to="/">
        <img src={avatar} alt="avatar" className={s.avatar} />
      </Link>
      <div className={s.info}>
        <p className={s.name}>{name}</p>
        <p className={s.descriptionTitle}>Description:</p>
        <p className={s.description}>{description}</p>
      </div>
    </div>
  );
};

export default UserCard;
