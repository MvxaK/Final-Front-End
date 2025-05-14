import React, { useContext, useState } from "react";
import { ImagesContext } from "../../context/ImagesContext";
import SearchBar from "./SearchBar";
import PicturesGallery from "./PicturesGallery";
import s from "./AllPictures.module.css";

const AllPictures = () => {
  const { allImages  } = useContext(ImagesContext);
  const [search, setSearch] = useState("");

  return (
    <div className={s.allpictures}>
      <SearchBar search={search} setSearch={setSearch} />
      <PicturesGallery images={allImages} />
    </div>
  );
};

export default AllPictures;
