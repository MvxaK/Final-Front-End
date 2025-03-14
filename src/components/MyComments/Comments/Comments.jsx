import React from 'react';
import s from './Comments.module.css';

const Comments = ({ id, message, image, likes, onRemove, onLike }) => {
  return (
    <div className={s.item}>
      {image && <img src={image} alt="avatar" />}
      <p>{message}</p>
      
      <div className={s.actions}>
        <button className={s.likeButton} onClick={() => onLike(id)}>Like ({likes})</button>
        <button className={s.removeButton} onClick={() => onRemove(id)}>Remove</button>
      </div>
    </div>
  );
};

export default Comments;
