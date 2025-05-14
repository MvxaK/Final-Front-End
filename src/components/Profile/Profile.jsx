import React, { useEffect, useState } from 'react';
import s from './Profile.module.css';
import MyComments from '../MyComments/MyComments';
import MyPictures from '../MyPictures/MyPictures';
import defaultAvatar from "../images/avatars/main_avatar.png";
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ProfileEditForm from './ProfileEditForm/ProfileEditForm';

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const isOwner = auth.currentUser && auth.currentUser.uid === userId;

  const fetchUserData = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        console.warn("User not found");
        setUserData(null);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((error) => console.error("Error:", error));
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!userData) {
    return <div>User not found or data loading failed.</div>;
  }

  const { name, lastname, avatarUrl, status } = userData;

  return (
    <div className={s.profile}>
      <div className={s.profileHeader}>
        <img className={s.avatar} src={avatarUrl || defaultAvatar} alt="Profile avatar" />
        <div className={s.profileInfo}>
          <h2>{`${name || 'Unnamed'} ${lastname || ''}`}</h2>
          <p>{status || ''}</p>

          {isOwner && (
            <>
              <button className={s.messageButton} onClick={() => setEditing(true)}>Edit profile</button>
              <br />
              <button className={s.logoutButton} onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>

      {editing && isOwner && (
        <ProfileEditForm
          user={auth.currentUser}
          onUpdate={fetchUserData}
          onClose={() => setEditing(false)}
        />
      )}

      <MyPictures userId={userId} />
      <MyComments
        profileId={userId}
        profileImage={avatarUrl || defaultAvatar}
        name={name}
        lastname={lastname}
      />
    </div>
  );
};

export default Profile;
