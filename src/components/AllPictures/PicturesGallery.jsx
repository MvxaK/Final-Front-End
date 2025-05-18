import React, { useRef, useState, useEffect } from "react";
import { Masonry, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import createCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import { useNavigate } from "react-router-dom";
import s from "./AllPictures.module.css";

const PicturesGallery = ({ images }) => {
  const navigate = useNavigate();

  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 300,
      fixedWidth: true,
    })
  );

  const masonryRef = useRef(null);
  const positioner = useRef(null);
  const lastColumnCount = useRef(0);

  const [masonryKey, setMasonryKey] = useState(Date.now());

  useEffect(() => {
    cache.current.clearAll();
    masonryRef.current?.clearCellPositions();
    positioner.current = null;
    setMasonryKey(Date.now());
  }, [images]);
  
  const handleImageClick = (image) => {
    navigate(`/picture/${image.id}`, {
      state: {
        imageSrc: image.src,
        title: image.title,
        description: image.description,
        ownerId: image.ownerId || null,
      },
    });
  };

  const cellRenderer = ({ index, key, parent, style }) => {
    const image = images[index];
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
              style={{ cursor: "pointer", width: "100%" }}
            />
            <p className={s.imageTitle}>{image.title}</p>
            <p className={s.imageDescription}>{image.description}</p>
          </div>
        </div>
      </CellMeasurer>
    );
  };
  
  return (
    <div className={s.allPicturesPage}>
      <div className={s.gallery}>
        <AutoSizer>
          {({ width, height }) => {
            const columnWidth = 300;
            const gutterSize = 20;
            const columnCount = Math.max(
              Math.floor(width / (columnWidth + gutterSize)),
              1
            );

            if (
              !positioner.current ||
              lastColumnCount.current !== columnCount
            ) {
              positioner.current = createCellPositioner({
                cellMeasurerCache: cache.current,
                columnCount,
                columnWidth,
                spacer: gutterSize,
              });
              lastColumnCount.current = columnCount;
            }
            
            return (
              <Masonry
                key={masonryKey}
                ref={masonryRef}
                cellCount={images.length}
                cellMeasurerCache={cache.current}
                cellPositioner={positioner.current}
                cellRenderer={cellRenderer}
                height={height}
                width={width}
                overscanByPixels={1000}
              />
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
};

export default PicturesGallery;