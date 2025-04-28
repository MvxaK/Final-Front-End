import React from "react";
import { useLocation } from "react-router-dom";
import s from "./PictureDetails.module.css";
import profileAvatar from "../images/avatars/main_avatar.png";

const PictureDetails = () => {
    const location = useLocation();
    const { imageSrc, description } = location.state || {};

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageSrc;
        link.download = "image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={s.container}>
            <div className={s.content}>
                <img className={s.image} src={imageSrc} alt="Selected" />
                <div className={s.details}>
                    <div className={s.userInfo}>
                        <img className={s.avatar} src={profileAvatar} alt="User avatar" />
                        <h2 className={s.userName}>Amir Kamalov</h2>
                    </div>
                    <h3 className={s.descriptionTitle}>Description: </h3>
                    <p className={s.description}>{description}</p>

                    <button className={s.downloadButton} onClick={handleDownload}>
                        Download Photo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PictureDetails;
