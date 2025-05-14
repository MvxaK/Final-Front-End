import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import s from './MyComments.module.css';
import Comments from './Comments/Comments';

export const MyComments = ({ profileId, profileImage, name, lastname }) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const isOwner = user?.uid === profileId;

  useEffect(() => {
    if (!profileId) return;

    const q = query(
      collection(db, 'comments'),
      where('profileId', '==', profileId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentsWithUserData = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const authorId = data.authorId;

        const userDoc = await getDoc(doc(db, 'users', authorId));
        const userData = userDoc.exists() ? userDoc.data() : {};

        return {
          id: docSnap.id,
          ...data,
          authorName: `${userData.name || 'Unknown'} ${userData.lastname || ''}`,
          authorAvatar: userData.avatarUrl || null
        };
      }));

      setComments(commentsWithUserData);
    });

    return () => unsubscribe();
  }, [profileId]);

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        profileId,
        authorId: user.uid,
        message: newComment.trim(),
        createdAt: serverTimestamp(),
        likes: {}
      });
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
    const updatedLikes = {
      ...comment.likes,
      [user.uid]: !alreadyLiked
    };

    try {
      await updateDoc(doc(db, 'comments', comment.id), {
        likes: updatedLikes
      });
    } catch (err) {
      console.error("Failed to like comment:", err);
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
          />
        ))}
      </div>
    </div>
  );
};

export default MyComments;
