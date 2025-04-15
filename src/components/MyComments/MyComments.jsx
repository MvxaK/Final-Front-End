import React, { useState } from 'react';
import s from './MyComments.module.css';
import Comments from './Comments/Comments';
import avatar1 from '../images/avatars/avatar1.png';
import avatar2 from '../images/avatars/avatar2.png';
import avatar3 from '../images/avatars/avatar3.png';
import avatar4 from '../images/avatars/avatar4.png';

export const MyComments = ({ profileImage }) => {
  const [comments, setComments] = useState([
    { id: 1, message: 'Example 1', image: avatar1, likes: 0 },
    { id: 2, message: 'Example 42', image: avatar2, likes: 0 },
    { id: 3, message: 'Example 49', image: avatar3, likes: 0 },
    { id: 4, message: 'Example 456', image: avatar4, likes: 0 }
  ]);

  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim() === '') return;
    const newId = comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;
    
    const newCommentObj = { id: newId, message: newComment, image: profileImage, likes: 0 };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const removeComment = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  const toggleLike = (id) => {
    setComments(comments.map(comment =>
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  return (
    <div>
      <p>Add new comment</p>
      <textarea 
        placeholder="Enter your comment here ..." 
        value={newComment} 
        onChange={(e) => setNewComment(e.target.value)}
      />
      <br />
      <button className={s.addButton} onClick={addComment}>Add</button>
      
      <div className={s.comments}>
        {comments.map(comment => (
          <Comments 
            key={comment.id} 
            id={comment.id}
            message={comment.message} 
            image={comment.image}
            likes={comment.likes}
            onRemove={removeComment}
            onLike={toggleLike}
          />
        ))}
      </div>
    </div>
  );
};

export default MyComments;
