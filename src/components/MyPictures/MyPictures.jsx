import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Masonry, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import createCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import s from "./MyPictures.module.css";

import picture1 from "../images/images_profile1/picture1.png";
import picture2 from "../images/images_profile1/picture2.png";
import picture3 from "../images/images_profile1/picture3.png";
import picture4 from "../images/images_profile1/picture4.png";
import picture5 from "../images/images_profile1/picture5.png";
import picture6 from "../images/images_profile1/picture6.png";
import picture7 from "../images/images_profile1/picture7.png";
import picture8 from "../images/images_profile1/picture8.png";
import picture9 from "../images/images_profile1/picture9.png";
import picture10 from "../images/images_profile1/picture10.png";
import picture11 from "../images/images_profile1/picture11.png";
import picture12 from "../images/images_profile1/picture12.png";
import picture13 from "../images/images_profile1/picture13.png";
import picture14 from "../images/images_profile1/picture14.png";

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

    const [images, setImages] = useState([
        { id: 1, src: picture1, description: "Nature and bridge" },
        { id: 2, src: picture2, description: "Beautiful mountain" },
        { id: 3, src: picture3, description: "Land and sun" },
        { id: 4, src: picture4, description: "Forest with sun light" },
        { id: 5, src: picture5, description: "Plant with sun" },
        { id: 6, src: picture6, description: "Mountain forest" },
        { id: 7, src: picture7, description: "Mountain forest" },
        { id: 8, src: picture8, description: "Mountain forest" },
        { id: 9, src: picture9, description: "Mountain forest" },
        { id: 10, src: picture10, description: "Mountain forest" },
        { id: 11, src: picture11, description: "Mountain forest" },
        { id: 12, src: picture12, description: "Mountain forest" },
        { id: 13, src: picture13, description: "Mountain forest" },
        { id: 14, src: picture14, description: "Mountain forest" },
    ]);

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
    const columnCount = 5;
    
    const positionerConfig = {
        cellMeasurerCache: cache,
        columnCount,
        columnWidth,
        spacer: gutterSize,
    };

    return createCellPositioner(positionerConfig);
}

export default MyPictures;
