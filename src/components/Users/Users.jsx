import React from "react";
import s from "./Users.module.css";
import UserCard from './Usercard/UserCard';
import avatar1 from "../images/avatars/avatar1.png";
import avatar2 from "../images/avatars/avatar2.png";
import avatar3 from "../images/avatars/avatar3.png";

const users = [
  {
    id: 1,
    name: "Amir Kamalov",
    avatar: avatar1,
    description: "Something something ...",
  },
  {
    id: 2,
    name: "Amir Kamalov 2",
    avatar: avatar2,
    description: "Something something ...",
  },
  {
    id: 3,
    name: "Amir Kamalov 3",
    avatar: avatar3,
    description: "Something something ...",
  },
];

const AllUsers = () => {
    return (
        <div className={s.container}>
          {users.map((user) => (
            <UserCard
              key={user.id}
              avatar={user.avatar}
              name={user.name}
              description={user.description}
            />
          ))}
        </div>
    );
};

export default AllUsers;
