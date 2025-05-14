import React from 'react';
import s from './UserCard.module.css';
import { Link } from 'react-router-dom';

const UserCard = ({ id, avatar, name, description }) => {
  return (
    <div className={s.card}>
      <Link to={`/profile/${id}`}>
        <img src={avatar} alt="avatar" className={s.avatar} />
      </Link>
      <div className={s.info}>
        <p className={s.name}>{name}</p>
        <p className={s.descriptionTitle}>Status: 
          <p className={s.description}>{description}</p>
        </p>
      </div>
    </div>
  );
};

export default UserCard;
