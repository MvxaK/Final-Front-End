import React from 'react';
import s from './Comments.module.css';
import avatar from '../../images/avatars/avatar2.png'

const Comments = ({ id, message, image, authorName, likes, isLiked, onRemove, onLike, showRemove, onAvatarClick  }) => {
  
  return (
    <div className={s.item}>
      <img
        src={image}
        alt="avatar"
        className={s.avatar}
        onClick={onAvatarClick}
        onError={(e) => { e.target.src = avatar; }}
      />
      <div className={s.contentWrapper}>
        <div className={s.content}>
          <div className={s.header}>
            <strong>{authorName}</strong>
          </div>
          <p>{message}</p>
        </div>
        <div className={s.actions}>
          <button className={s.likeButton} onClick={onLike}>
            {isLiked ? '❤️' : '🤍'} Like ({likes})
          </button>
          {showRemove && (
            <button className={s.removeButton} onClick={onRemove}>Remove</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
