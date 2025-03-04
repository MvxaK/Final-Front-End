import React from 'react';
import s from './Comments.module.css';

const Comments = (props) => {
  return (
    <div className={s.item}>
      {props.image && <img src={props.image} alt="avatar" />}
      <p>{props.message}</p>
      <div>
        <button className={s.likeButton}>Like</button>
      </div>
    </div>
  );
};

export default Comments;