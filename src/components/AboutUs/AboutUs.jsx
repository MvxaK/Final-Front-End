import React from 'react';
import s from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={s.about_wrapper}>
      <div className={s.about_container}>
        <div className={s.about_image}>
          <img src="https://www.recordnet.com/gcdn/presto/2021/03/22/NRCD/9d9dd9e4-e84a-402e-ba8f-daa659e6e6c5-PhotoWord_003.JPG?width=660&height=425&fit=crop&format=pjpg&auto=webp" alt="About" className={s.about_img} />
        </div>
        <div className={s.about_text}>
          <h2 className={s.about_title}>Welcome to PicSh</h2>
          <p className={s.about_paragraph}>
            <strong>PictureShare</strong> — this is a modern space for everyone who loves to share moments of their lives through photography. We have created a convenient platform for inspiration and communication.
          </p>
          <ul className={s.about_list}>
            <li>Modern minimum design</li>
            <li>Fast and easy image uploading</li>
            <li>Secure authentication</li>
            <li>View and comment others</li>
          </ul>
          <p className={s.about_paragraph}>
            Our service helps you find like-minded people and unleash your creativity
          </p>
          <h4 className={s.about_subtitle}>Why choose us? </h4>
          <ul className={s.about_list}>
            <li>Beautiful interface</li>
            <li>Easy to use</li>
          </ul>
          <button
            className={s.about_button}
            onClick={() => window.location.href = '/login'}
          >
            join us
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
