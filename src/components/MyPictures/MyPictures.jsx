import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Masonry, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import createCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import { uploadBytes, getDownloadURL, ref as storageRef, deleteObject } from "firebase/storage";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { storage, db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import s from "./MyPictures.module.css";
import EditPicture from "../MyPictures/EditPicture/EditPicture";
import SearchBar from "../AllPictures/SearchBar";

const MyPictures = ({ userId }) => {
  const navigate = useNavigate();
  const [authUser] = useAuthState(auth);
  const isOwner = authUser?.uid === userId;

  const [userImages, setUserImages] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [editingImage, setEditingImage] = useState(null);
  const [masonryKey, setMasonryKey] = useState(Date.now());

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

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "pictures"), where("ownerId", "==", userId));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedImages = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const imageData = docSnap.data();
          const ownerRef = doc(db, "users", imageData.ownerId);
          const ownerSnap = await getDoc(ownerRef);
          const ownerData = ownerSnap.exists() ? ownerSnap.data() : {};

          return {
            id: docSnap.id,
            src: imageData.imageUrl,
            title: imageData.title || "",
            description: imageData.description || "",
            ownerId: imageData.ownerId,
            ownerName: `${ownerData.name || ""} ${ownerData.lastname || ""}`,
            ownerAvatar: ownerData.avatarUrl || "",
            createdAt: imageData.createdAt?.toDate?.() || new Date(0),
          };
        })
      );

      setUserImages(fetchedImages);
      cache.current.clearAll();
      masonryRef.current?.clearCellPositions();
      positioner.current = null;
      setMasonryKey(Date.now());
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
      const imageRef = storageRef(storage, `pictures/${authUser.uid}/${Date.now()}_${newImageFile.name}`);
      await uploadBytes(imageRef, newImageFile);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "pictures"), {
        ownerId: authUser.uid,
        imageUrl,
        title,
        description,
        imagePath: imageRef.fullPath,
        createdAt: serverTimestamp(),
      });

      setNewImageFile(null);
      setDescription("");
      setTitle("");
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
        title: image.title,
        description: image.description,
        ownerId: image.ownerId,
      },
    });
  };

  const filteredImages = userImages
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

  const cellRenderer = ({ index, key, parent, style }) => {
    const image = filteredImages[index];
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
              style={{ cursor: "pointer", width: "100%" }}
            />
            <div className={s.overlayTop}>
              <p className={s.imageTitle}>{image.title}</p>
            </div>
            {isOwner && (
              <div className={s.ownerControls}>
                <button className={s.editButton} onClick={() => setEditingImage(image)}>
                  Edit
                </button>
                <button className={s.removeButton} onClick={() => removeImage(image.id)}>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </CellMeasurer>
    );
  };

  const removeImage = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      const docRef = doc(db, "pictures", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const imageData = docSnap.data();

        if (imageData.imagePath) {
          const imgRef = storageRef(storage, imageData.imagePath);
          await deleteObject(imgRef);
        }

        await deleteDoc(docRef);
      }

      setUserImages((prev) => prev.filter((image) => image.id !== id));
    } catch (error) {
      alert("Failed to delete: " + error.message);
    }
  };

  return (
    <div className={s.mypictures}>
      {isOwner && (
        <>
          <p className={s.title}>Add New Picture</p>
          <input
            type="text"
            className={s.input}
            placeholder="Enter picture title here ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
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
      <br></br>
      <div className={s.searchDiv}>
        <SearchBar search={search} setSearch={setSearch} />
          <br />
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
      </div>
      <h1>{isOwner ? "Your gallery" : "User's gallery"}</h1>
      <div className={s.gallery}>
        <AutoSizer>
          {({ width, height }) => {
            const columnWidth = 300;
            const gutterSize = 20;
            const columnCount = Math.max(Math.floor(width / (columnWidth + gutterSize)), 1);

            if (!positioner.current || lastColumnCount.current !== columnCount) {
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
      {editingImage && <EditPicture picture={editingImage} onClose={() => setEditingImage(null)} />}
    </div>
  );
};

export default MyPictures;