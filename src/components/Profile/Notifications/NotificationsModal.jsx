import React, { useEffect, useState } from 'react';
import { collection, doc, deleteDoc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import s from './NotificationsModal.module.css';

const NotificationsModal = ({ userId, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({ comments: true, likes: true });

  useEffect(() => {
    const fetchNotifications = async () => {
      const userDocRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userDocRef);

      let prefs = { comments: true, likes: true };
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.notificationPrefs) {
          prefs = data.notificationPrefs;
          setPreferences(prefs);
        }
      }

      const snapshot = await getDocs(collection(db, 'users', userId, 'notifications'));
      const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const enriched = await Promise.all(
        rawData.map(async (notif) => {
          if (!notif.fromUserId) return notif;

          try {
            const userSnap = await getDoc(doc(db, "users", notif.fromUserId));
            const userData = userSnap.exists() ? userSnap.data() : {};
            return {
              ...notif,
              fromUserName: `${userData.name || 'Unknown'} ${userData.lastname || ''}`,
            };
          } catch (err) {
            console.error("Failed to load user for notification", err);
            return notif;
          }
        })
      );

      const filtered = enriched.filter(n => {
        if (n.type === 'comment') return prefs.comments;
        if (n.type === 'like') return prefs.likes;
        return true;
      });

      setNotifications(filtered);
    };

    fetchNotifications();
  }, [userId]);




  const handleMarkAsRead = async (id) => {
    await deleteDoc(doc(db, 'users', userId, 'notifications', id));
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handlePreferenceChange = async (type) => {
    const newPreferences = { ...preferences, [type]: !preferences[type] };
    setPreferences(newPreferences);
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      [`notificationPrefs.${type}`]: newPreferences[type]
    });
  };

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <h3>Notifications</h3>

        <div className={s.section}>
          <label>
            <input
              type="checkbox"
              checked={preferences.comments}
              onChange={() => handlePreferenceChange('comments')}
            />
            Comments
          </label>
          <label>
            <input
              type="checkbox"
              checked={preferences.likes}
              onChange={() => handlePreferenceChange('likes')}
            />
            Likes
          </label>
        </div>

        <div className={s.section}>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n) => {
              const date = n.createdAt?.toDate?.();
              const formattedDate = date ? date.toLocaleString() : 'just now';

              return (
                <div key={n.id} className={s.notification}>
                  <span>
                    {n.type === 'comment' && `${n.fromUserName || 'Someone'} commented on your profile`}
                    {n.type === 'like' && `${n.fromUserName || 'Someone'} liked your comment`}
                    <a href={`/profile/${n.profileId}`} style={{ marginLeft: '5px', color: '#4ea3ff' }}>View</a>
                  </span>
                  <div className={s.timestamp}>{formattedDate}</div>
                  <button onClick={() => handleMarkAsRead(n.id)}>Mark as read</button>
                </div>
              );
            })
          )}
        </div>

        <div className={s.buttons}>
          <button onClick={onClose} className={s.cancel}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
