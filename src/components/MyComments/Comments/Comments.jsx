import React from 'react';
import s from './Comments.module.css';

const Comments = ({ id, message, image, authorName, likes, isLiked, onRemove, onLike }) => {
  return (
    <div className={s.item}>
      <div className={s.header}>
        {image && <img src={image} alt="avatar" className={s.avatar} />}
        <strong>{authorName}</strong>
      </div>
      <p>{message}</p>

      <div className={s.actions}>
        <button className={s.likeButton} onClick={onLike}>
          {isLiked ? '❤️' : '🤍'} Like ({likes})
        </button>
        <button className={s.removeButton} onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
};

export default Comments;
