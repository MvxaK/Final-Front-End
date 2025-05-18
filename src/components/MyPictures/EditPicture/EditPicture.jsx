import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import s from "./EditPicture.module.css";

const EditPicture = ({ picture, onClose }) => {
  const [title, setTitle] = useState(picture.title);
  const [description, setDescription] = useState(picture.description);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "pictures", picture.id);
      await updateDoc(docRef, {
        title,
        description,
      });
      onClose();
    } catch (error) {
      alert("Failed to update: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <h2>Edit Picture</h2>
        <input
          className={s.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className={s.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className={s.buttons}>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className={s.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPicture;
