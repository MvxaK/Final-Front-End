import React, { useEffect, useState } from "react";
import s from "./Users.module.css";
import UserCard from './Usercard/UserCard';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import defaultAvatar from "../images/avatars/main_avatar.png";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={s.container}>
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          avatar={user.avatarUrl || defaultAvatar}
          name={`${user.name || "Unnamed"} ${user.lastname || ""}`}
          description={user.status || "No status yet..."}
        />
      ))}
    </div>
  );
};

export default AllUsers;
