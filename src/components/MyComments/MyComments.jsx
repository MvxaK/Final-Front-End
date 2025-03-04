import React from 'react';
import s from './MyComments.module.css';
import Comments from './Comments/Comments';
import avatar1 from '../images/avatars/avatar1.png';
import avatar2 from '../images/avatars/avatar2.png';
import avatar3 from '../images/avatars/avatar3.png';
import avatar4 from '../images/avatars/avatar4.png';


const MyComments = () => {
  const postsData = [
    { message: 'Example 1', image: avatar1 },
    { message: 'Example 42', image:  avatar2 },
    { message: 'Example 49', image:  avatar3 },
    { message: 'Example 456', image: avatar4  }
  ];

  return (
    <div>
      <p>Add new comment</p>
      <textarea placeholder="Enter your comment here ..."></textarea>
      <br />
      <button className={s.addButton}>Add </button>
      <button className={s.removeButton}>Remove</button>
      
      <div className={s.comments}>
        {postsData.map((post, index) => (
          <Comments key={index} message={post.message} image={post.image} />
        ))}
      </div>
    </div>
  );
};

export default MyComments;