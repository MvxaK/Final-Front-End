import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./PictureDetails.module.css";
import ThedogAvatar from "../images/avatars/thedogapi.jpg";
import profileAvatar from "../images/avatars/main_avatar.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const PictureDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageSrc, title, description, ownerId } = location.state || {};
  const isApiImage = imageSrc?.includes("thedogapi.com") || false;

  const [userInfo, setUserInfo] = useState({
    name: "",
    lastname: "",
    avatarUrl: profileAvatar,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isApiImage) {
      setUserInfo({
        name: "TheDogAPI",
        lastname: "",
        avatarUrl: ThedogAvatar,
      });
      return;
    }
      if (!ownerId) {
        setUserInfo({
          name: "Amir",
          lastname: "Kamalov",
          avatarUrl: profileAvatar,
        });
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", ownerId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserInfo({
            name: data.name || "",
            lastname: data.lastname || "",
            avatarUrl: data.avatarUrl || profileAvatar,
          });
        } else {
          setUserInfo({
            name: "Unknown",
            lastname: "User",
            avatarUrl: profileAvatar,
          });
        }
      } catch (error) {
        console.error("Error with user info:", error);
        setUserInfo({
          name: "Error",
          lastname: "Loading",
          avatarUrl: profileAvatar,
        });
      }
    };

    fetchUserInfo();
  }, [ownerId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpg";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image.");
    }
  };

  const handleProfileClick = () => {
    if (ownerId) {
      navigate(`/profile/${ownerId}`);
    }
  };

  const handleButtonClick = () => {
    navigate(`/`);
  };

  return (
    <div className={s.container}>
      <div className={s.content}>
        <img className={s.image} src={imageSrc} alt="Selected" />
        <div className={s.details}>
          <div className={s.userInfo}>
            <img
              className={s.avatar}
              src={userInfo.avatarUrl}
              alt="User avatar"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
            <h2 className={s.userName}>
              {userInfo.name} {userInfo.lastname}
            </h2>
          </div>
          <h2 className={s.imageTitle}>Title: {title}</h2>
          <p className={s.description}>Description: {description}</p>

          {!isApiImage && (
            <button className={s.downloadButton} onClick={handleDownload}>
              Download Photo
            </button>
          )}
          {isApiImage && (
            <p style={{ color: "gray", fontStyle: "italic" }}>
              Download isn`t allowed due to security and law reasons.
            </p>
          )}
          <button className={s.backButton} onClick={handleButtonClick}>
              Back
            </button>
        </div>
      </div>
    </div>
  );
};

export default PictureDetails;
