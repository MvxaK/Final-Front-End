import React from "react";
import s from "./AllPictures.module.css";

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      className={s.searchBar}
      type="text"
      placeholder="Search images..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchBar;
