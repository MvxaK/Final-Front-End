import React, { useContext, useState } from "react";
import { ImagesContext } from "../../context/ImagesContext";
import SearchBar from "./SearchBar";
import PicturesGallery from "./PicturesGallery";
import s from "./AllPictures.module.css";

const AllPictures = () => {
  const { allImages  } = useContext(ImagesContext);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  
   const filteredImages = allImages
    .filter((img) =>
      img.description.toLowerCase().includes(search.toLowerCase()) ||
      img.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return b.createdAt - a.createdAt;
        case "date-asc":
          return a.createdAt - b.createdAt;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <div className={s.allpictures}>
        <SearchBar search={search} setSearch={setSearch} />
        <br></br>
        <select
          className={s.sortSelect}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      <PicturesGallery images={filteredImages} />
    </div>
  );
};

export default AllPictures;
