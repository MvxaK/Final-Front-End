import React, { useContext, useRef, useState, useEffect } from "react";
import { ImagesContext } from "../../context/ImagesContext";
import { Masonry, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import createCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import { useNavigate } from "react-router-dom";
import s from "./AllPictures.module.css";

const PicturesGallery = () => {
  const { allImages } = useContext(ImagesContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredImages = allImages.filter((img) =>
    img.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageClick = (image) => {
    navigate(`/picture/${image.id}`, {
        state: {
          imageSrc: image.src,
          description: image.description,
          ownerId: image.ownerId || null,
        },
      });
  };

  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 300,
      fixedWidth: true,
    })
  );

  const masonryRef = useRef(null);
  const positioner = useRef(null);

  useEffect(() => {
    if (cache.current) {
      cache.current.clearAll();
    }
    if (masonryRef.current) {
      masonryRef.current.clearCellPositions();
    }
  }, [filteredImages]);

  const cellRenderer = ({ index, key, parent, style }) => {
    const image = filteredImages[index];
    if (!image) return null;

    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          <div className={s.imagePost}>
            <img
              className={s.uploadedImage}
              src={image.src}
              alt={image.description}
              onClick={() => handleImageClick(image)}
              style={{ cursor: "pointer" }}
            />
            <p className={s.imageDescription}>{image.description}</p>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div className={s.allPicturesPage}>
      <input
        className={s.searchBar}
        type="text"
        placeholder="Search images..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={s.gallery}>
      <AutoSizer>
        {({ width, height }) => {
          const columnWidth = 300;
          const gutterSize = 20;
          const columnCount = Math.max(Math.floor(width / (columnWidth + gutterSize)), 1);

          if (!positioner.current || positioner.current.columnCount !== columnCount) {
            positioner.current = createCellPositioner({
              cellMeasurerCache: cache.current,
              columnCount,
              columnWidth,
              spacer: gutterSize,
            });
          }

          return (
            <Masonry
              ref={masonryRef}
              cellCount={filteredImages.length}
              cellMeasurerCache={cache.current}
              cellPositioner={positioner.current}
              cellRenderer={cellRenderer}
              height={height}
              width={width}
              overscanByPixels={300}
            />
          );
        }}
      </AutoSizer>
      </div>
    </div>
  );
};

export default PicturesGallery;
