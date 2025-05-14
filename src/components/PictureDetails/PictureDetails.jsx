import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import s from "./PictureDetails.module.css";
import profileAvatar from "../images/avatars/main_avatar.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const PictureDetails = () => {
  const location = useLocation();
  const { imageSrc, description, ownerId } = location.state || {};

  console.log("location.state:", location.state);
  console.log("ownerId:", ownerId);

  const [userInfo, setUserInfo] = useState({
    name: "",
    lastname: "",
    avatarUrl: profileAvatar,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!ownerId) {
        setUserInfo({
          name: "Amir",
          lastname: "Kamalov",
          avatarUrl: profileAvatar,
        });
        return <p>Loading...</p>;;
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
        console.error("Error fetching user info:", error);
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
            />
            <h2 className={s.userName}>
              {userInfo.name} {userInfo.lastname}
            </h2>
          </div>
          <h3 className={s.descriptionTitle}>Description:</h3>
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
