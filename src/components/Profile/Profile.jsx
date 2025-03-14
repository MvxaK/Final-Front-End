import React from 'react';
import s from './Profile.module.css';
import MyComments from '../MyComments/MyComments';
import MyPictures from '../MyPictures/MyPictures';

const Profile = () => {
    const profileImage = "https://iso.500px.com/wp-content/uploads/2019/07/stock-photo-maderas-312058103.jpg";

    return (
      <div className={s.profile}>
        <div className={s.profileHeader}>
          <img className={s.avatar} src={profileImage} alt="Profile background" />
          <div className={s.profileInfo}>
            <h2>Amir Kamalov</h2>
            <p>Something something ... </p>
            <button className={s.messageButton}>Go to the dialog</button>
          </div>
        </div>

        <MyPictures />
        
        <MyComments profileImage={profileImage} />
      </div>
    );
};

export default Profile;
