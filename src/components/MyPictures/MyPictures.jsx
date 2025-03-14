import React, { useState } from 'react';
import s from './MyPictures.module.css';
import picture1 from '../images/images_profile1/picture1.png';
import picture2 from '../images/images_profile1/picture2.png';
import picture3 from '../images/images_profile1/picture3.png';
import picture4 from '../images/images_profile1/picture4.png';
import picture5 from '../images/images_profile1/picture5.png';
import picture6 from '../images/images_profile1/picture6.png';

const MyPictures = () => {
    const [images, setImages] = useState([
        { id: 1, src: picture1, title: 'Picture 1' },
        { id: 2, src: picture2, title: 'Picture 2' },
        { id: 3, src: picture3, title: 'Picture 3' },
        { id: 4, src: picture4, title: 'Picture 4' },
        { id: 5, src: picture5, title: 'Picture 5' },
        { id: 6, src: picture6, title: 'Picture 6' },
    ]);

    const [newImage, setNewImage] = useState(null);
    const [description, setDescription] = useState('');

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
            setImages([...images, { id: newId, src: newImage, title: description }]);
            setNewImage(null);
            setDescription('');
        }
    };

    const removeImage = (id) => {
        setImages(images.filter(image => image.id !== id));
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
            <input type="file" className={s.fileInput} onChange={handleImageUpload} />
            <button className={s.addButton} onClick={addImage}>Add</button>
            
            <h1>Your gallery</h1>
            <div className={s.gallery}>
                {images.map(image => (
                    <div key={image.id} className={s.imagePost}>
                        <img className={s.uploadedImage} src={image.src} alt="User picture" />
                        <button className={s.removeButton} onClick={() => removeImage(image.id)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPictures;
