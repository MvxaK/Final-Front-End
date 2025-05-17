import React from 'react';
import s from './Comments.module.css';

const Comments = ({ id, message, image, authorName, likes, isLiked, onRemove, onLike, showRemove, onAvatarClick  }) => {
  
  return (
    <div className={s.item}>
      <div className={s.header}>
        <img
          src={image}
          alt="avatar"
          className={s.avatar}
          onClick={onAvatarClick}
          onError={(e) => { e.target.src = '/fallback_avatar.png'; }}
        />
        <strong>{authorName}</strong>
      </div>
      <p>{message}</p>

      <div className={s.actions}>
        <button className={s.likeButton} onClick={onLike}>
          {isLiked ? '❤️' : '🤍'} Like ({likes})
        </button>
        {showRemove && (
          <button className={s.removeButton} onClick={onRemove}>Remove</button>
        )}
      </div>
    </div>
  );
};

export default Comments;
