import React, { useEffect, useState } from 'react';
import s from './Profile.module.css';
import MyComments from '../MyComments/MyComments';
import MyPictures from '../MyPictures/MyPictures';
import defaultAvatar from "../images/avatars/main_avatar.png";
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ProfileEditForm from './ProfileEditForm/ProfileEditForm';

const Profile = () => {
  const [name, setName] = useState('Loading...');
  const [lastname, setLastname] = useState('');
  const [photoURL, setPhotoURL] = useState(defaultAvatar);
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || 'Unnamed');
        setLastname(data.lastname || '');
        setPhotoURL(data.avatarUrl || defaultAvatar);
        setStatus(data.status || '');
      } else {
        setName('Unnamed');
        setLastname('');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [auth.currentUser]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className={s.profile}>
      <div className={s.profileHeader}>
        <img className={s.avatar} src={photoURL} alt="Profile avatar" />
        <div className={s.profileInfo}>
          <h2>{`${name} ${lastname}`}</h2>
          <p>{status}</p>
          <button className={s.messageButton} onClick={() => setEditing(true)}>Edit profile</button>
          <br />
          <button className={s.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {editing && (
        <ProfileEditForm
          user={auth.currentUser}
          onUpdate={fetchUserData}
          onClose={() => setEditing(false)}
        />
      )}

      <MyPictures />
      <MyComments profileImage={photoURL} />
    </div>
  );
};

export default Profile;
