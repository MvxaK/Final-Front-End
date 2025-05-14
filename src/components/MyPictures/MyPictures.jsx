import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Masonry, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import createCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import s from "./MyPictures.module.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc, getDoc, collection, query, where, onSnapshot,
  addDoc, serverTimestamp
} from "firebase/firestore";
import { storage, db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const MyPictures = ({ userId }) => {
  const navigate = useNavigate();
  const [authUser] = useAuthState(auth);
  const isOwner = authUser?.uid === userId;

  const [userImages, setUserImages] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 300,
      fixedWidth: true,
    })
  );
  const masonryRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "pictures"), where("ownerId", "==", userId));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedImages = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const imageData = docSnap.data();
        const ownerRef = doc(db, "users", imageData.ownerId);
        const ownerSnap = await getDoc(ownerRef);
        const ownerData = ownerSnap.exists() ? ownerSnap.data() : {};

        return {
          id: docSnap.id,
          src: imageData.imageUrl,
          description: imageData.description || "",
          ownerId: imageData.ownerId,
          ownerName: `${ownerData.name || ''} ${ownerData.lastname || ''}`,
          ownerAvatar: ownerData.avatarUrl || '',
        };
      }));

      setUserImages(fetchedImages);
      cache.current.clearAll();
      masonryRef.current?.clearCellPositions();
    });

    return () => unsubscribe();
  }, [userId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("Image size must be less than 1 MB.");
        return;
      }
      setNewImageFile(file);
    }
  };

  const addImage = async () => {
    if (!newImageFile || !authUser) return;

    setUploading(true);
    try {
      const imageRef = ref(storage, `pictures/${authUser.uid}/${Date.now()}_${newImageFile.name}`);
      await uploadBytes(imageRef, newImageFile);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "pictures"), {
        ownerId: authUser.uid,
        imageUrl,
        description,
        createdAt: serverTimestamp(),
      });

      setNewImageFile(null);
      setDescription("");
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (image) => {
    navigate(`/picture/${image.id}`, {
      state: {
        imageSrc: image.src,
        description: image.description,
        ownerId: image.ownerId,
      },
    });
  };

  const cellRenderer = ({ index, key, parent, style }) => {
    const image = userImages[index];
    if (!image) return null;

    return (
      <CellMeasurer key={key} cache={cache.current} parent={parent} columnIndex={0} rowIndex={index}>
        <div style={style}>
          <div className={s.imagePost}>
            <img
              className={s.uploadedImage}
              src={image.src}
              alt={image.description}
              onClick={() => handleImageClick(image)}
              style={{ cursor: "pointer" }}
            />
            {isOwner && (
              <button className={s.removeButton} onClick={() => removeImage(image.id)}>
                Remove
              </button>
            )}
          </div>
        </div>
      </CellMeasurer>
    );
  };

  const removeImage = (id) => {
    setUserImages((prev) => {
      const updated = prev.filter((image) => image.id !== id);
      cache.current.clearAll();
      masonryRef.current?.clearCellPositions();
      return updated;
    });
  };

  return (
    <div className={s.mypictures}>
      {isOwner && (
        <>
          <p className={s.title}>Add New Picture</p>
          <textarea
            className={s.textarea}
            placeholder="Enter picture description here ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <input
            type="file"
            className={s.fileInput}
            onChange={handleImageUpload}
            aria-label="upload file"
            accept="image/*"
          />
          <button className={s.addButton} onClick={addImage} disabled={uploading || !newImageFile}>
            {uploading ? "Uploading..." : "Add"}
          </button>
        </>
      )}

      <h1>{isOwner ? "Your gallery" : "User's gallery"}</h1>
      <div className={s.gallery}>
        <AutoSizer>
          {({ width, height }) => (
            <Masonry
              ref={masonryRef}
              cellCount={userImages.length}
              cellMeasurerCache={cache.current}
              cellPositioner={CellPositioner(cache.current, width)}
              cellRenderer={cellRenderer}
              height={height}
              width={width}
              overscanByPixels={1}
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

  return createCellPositioner({
    cellMeasurerCache: cache,
    columnCount,
    columnWidth,
    spacer: gutterSize,
  });
}

export default MyPictures;
