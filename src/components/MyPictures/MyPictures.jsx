import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Masonry, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import createCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import s from "./MyPictures.module.css";
import { useContext } from "react";
import { ImagesContext } from "../../context/ImagesContext";


const MyPictures = () => {
    const navigate = useNavigate();
    const cache = useRef(
        new CellMeasurerCache({
            defaultHeight: 250,
            defaultWidth: 300,
            fixedWidth: true,
        })
    );

    const masonryRef = useRef(null);
    const { images, setImages } = useContext(ImagesContext);
    

    const [newImage, setNewImage] = useState(null);
    const [description, setDescription] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addImage = () => {
        if (newImage) {
            const newId = images.length + 1;
            setImages((prev) => {
                const updated = [...prev, { id: newId, src: newImage, description }];
                cache.current.clearAll();
                if (masonryRef.current) masonryRef.current.clearCellPositions();
                return updated;
            });
            setNewImage(null);
            setDescription("");
        }
    };

    const removeImage = (id) => {
        setImages((prev) => {
            const updated = prev.filter((image) => image.id !== id);
            cache.current.clearAll();
            if (masonryRef.current) masonryRef.current.clearCellPositions();
            return updated;
        });
    };

    const handleImageClick = (image) => {
        navigate("/picture/:id", {
            state: { imageSrc: image.src, description: image.description },
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
                            style={{ cursor: "pointer" }}
                        />
                        <button
                            className={s.removeButton}
                            onClick={() => removeImage(image.id)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </CellMeasurer>
        );
    };

    return (
        <div className={s.mypictures}>
            <p className={s.title}>Add New Picture</p>
            <textarea
                className={s.textarea}
                placeholder="Enter picture description here ..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <input type="file" className={s.fileInput} onChange={handleImageUpload} aria-label="upload file" />
            <button className={s.addButton} onClick={addImage}>
                Add
            </button>

            <h1>Your gallery</h1>
            <div className={s.gallery}>
                <AutoSizer>
                    {({ width, height }) => (
                        <Masonry
                            ref={masonryRef}
                            cellCount={images.length}
                            cellMeasurerCache={cache.current}
                            cellPositioner={CellPositioner(cache.current, width)}
                            cellRenderer={cellRenderer}
                            height={height}
                            width={width}
                            overscanByPixels={300}
                        />
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

function CellPositioner(cache, width) {
    const columnWidth = 300;
    const gutterSize = 20;
    const columnCount = Math.floor(width / (columnWidth + gutterSize));

    
    const positionerConfig = {
        cellMeasurerCache: cache,
        columnCount,
        columnWidth,
        spacer: gutterSize,
    };

    return createCellPositioner(positionerConfig);
}

export default MyPictures;
