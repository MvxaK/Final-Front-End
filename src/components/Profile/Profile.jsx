import React from 'react';
import s from './Profile.module.css';
import MyComments from '../MyComments/MyComments';
import MyPictures from '../MyPictures/MyPictures';
import profileAvatar from "../images/avatars/main_avatar.png";

const Profile = () => {
    const profileImage = profileAvatar;

    return (
      <div className={s.profile}>
        <div className={s.profileHeader}>
          <img className={s.avatar} src={profileImage} alt="Profile background" />
          <div className={s.profileInfo}>
            <h2>Amir Kamalov</h2>
            <p>Something something ... </p>
            <button className={s.messageButton}>Edit profile</button>
          </div>
        </div>

        <MyPictures />
        
        <MyComments profileImage={profileImage} />
      </div>
    );
};

export default Profile;
