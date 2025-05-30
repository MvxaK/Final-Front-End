import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import s from './MyComments.module.css';
import Comments from './Comments/Comments';
import defaultAvatar from '../images/avatars/main_avatar.png';
import { useNavigate } from 'react-router-dom';

export const MyComments = ({ profileId, profileImage, name, lastname }) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileId) return;

    const q = query(
      collection(db, 'comments'),
      where('profileId', '==', profileId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentDocs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      .filter(comment => comment.createdAt)
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      Promise.all(commentDocs.map(async (comment) => {
        const userDoc = await getDoc(doc(db, 'users', comment.authorId));
        const userData = userDoc.exists() ? userDoc.data() : {};
        return {
          ...comment,
          authorName: `${userData.name || 'Unknown'} ${userData.lastname || ''}`,
          authorAvatar: userData.avatarUrl || defaultAvatar
        };
      })).then(setComments);
    });

    return () => unsubscribe();
  }, [profileId]);

  const addComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        profileId,
        authorId: user.uid,
        message: newComment.trim(),
        createdAt: serverTimestamp(),
        likes: {}
      });

      if (user.uid !== profileId) {
        await addDoc(collection(db, 'users', profileId, 'notifications'), {
          fromUserId: user.uid,
          type: 'comment',
          commentId: docRef.id,
          profileId: profileId,
          isRead: false,
          createdAt: serverTimestamp()
        });
      }

      setNewComment('');
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const removeComment = async (id, authorId) => {
    if (!user || (authorId !== user.uid && profileId !== user.uid)) return;
    try {
      await deleteDoc(doc(db, 'comments', id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const toggleLike = async (comment) => {
    if (!user) return;

    const alreadyLiked = comment.likes?.[user.uid] === true;
    const updatedLikes = { ...comment.likes };

    if (alreadyLiked) {
      delete updatedLikes[user.uid];
    } else {
      updatedLikes[user.uid] = true;

      if (user.uid !== comment.authorId) {
        try {
          await addDoc(collection(db, 'users', comment.authorId, 'notifications'), {
            fromUserId: user.uid,
            type: 'like',
            commentId: comment.id,
            profileId: profileId,
            isRead: false,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error('Errow with like notification:', err);
        }
      }
    }

    try {
      await updateDoc(doc(db, 'comments', comment.id), {
        likes: updatedLikes
      });
    } catch (err) {
      console.error("Error with update like:", err);
    }
  };
  
  return (
    <div>
      <h3>Comments for {name} {lastname}</h3>

      {user && (
        <div className={s.addBlock}>
          <textarea
            placeholder="Enter your comment here ..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <br />
          <button className={s.addButton} onClick={addComment}>Add</button>
        </div>
      )}

      <div className={s.comments}>
        {comments.map(comment => (
          <Comments
            key={comment.id}
            id={comment.id}
            message={comment.message}
            image={comment.authorAvatar}
            authorName={comment.authorName}
            likes={Object.keys(comment.likes || {}).length}
            isLiked={!!comment.likes?.[user?.uid]}
            onRemove={() => removeComment(comment.id, comment.authorId)}
            onLike={() => toggleLike(comment)}
            showRemove={user && (comment.authorId === user.uid || profileId === user.uid)}
            onAvatarClick={() => navigate(`/profile/${comment.authorId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyComments;
