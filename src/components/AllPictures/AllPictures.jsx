import React, { useContext, useState } from "react";
import { ImagesContext } from "../../context/ImagesContext";
import SearchBar from "./SearchBar";
import PicturesGallery from "./PicturesGallery";
import s from "./AllPictures.module.css";

const AllPictures = () => {
  const { allImages  } = useContext(ImagesContext);
  const [search, setSearch] = useState("");

  const filteredImages = allImages.filter((img) =>
    img.description.toLowerCase().includes(search.toLowerCase()) ||
    img.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={s.allpictures}>
      <SearchBar search={search} setSearch={setSearch} />
      <PicturesGallery images={filteredImages} />
    </div>
  );
};

export default AllPictures;
