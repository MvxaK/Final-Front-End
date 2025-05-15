import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import s from './ProfileEditForm.module.css';

const ProfileEditForm = ({ user, onUpdate, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [status, setStatus] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setFirstName(data.name || '');
        setLastName(data.lastname || '');
        setStatus(data.status || '');
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      let photoURL = null;

      if (currentPassword && newPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      if (avatarFile && userSnap.exists()) {
        const existingData = userSnap.data();
        const oldAvatarUrl = existingData.avatarUrl;
        if (oldAvatarUrl) {
          try {
            const path = decodeURIComponent(oldAvatarUrl.split('/o/')[1].split('?')[0]);
            const oldRef = ref(storage, path);
            await deleteObject(oldRef);
          } catch (err) {
            console.warn('Error deleting old avatar:', err.message);
          }
        }
      }

      if (avatarFile) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, avatarFile);
        photoURL = await getDownloadURL(avatarRef);
      }

      const updates = {
        name: firstName.trim(),
        lastname: lastName.trim(),
        status: status.trim(),
      };

      if (photoURL) {
        updates.avatarUrl = `${photoURL}?t=${Date.now()}`;
      }

      await updateDoc(userRef, updates);

      onUpdate();
      onClose();
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        alert('Incorrect current password.');
      } else if (error.code === 'auth/weak-password') {
        alert('New password is too weak (minimum 6 characters).');
      } else if (error.code === 'auth/requires-recent-login') {
        alert('Please log out and log in again to change your password.');
      } else {
        alert('Error: ' + error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <h3>Edit Profile</h3>
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <textarea
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && file.size > 1 * 1024 * 1024) {
            alert('File size should be less than 1 MB');
            return;
          }
          setAvatarFile(file);
        }}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default ProfileEditForm;
