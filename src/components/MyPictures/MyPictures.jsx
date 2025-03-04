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

    const removeImage = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    return (
        <div className={s.mypictures}>
            <p className={s.title}>Add New Picture</p>
            <textarea className={s.textarea} placeholder="Enter picture description here ..."></textarea>
            <br />
            <button className={s.addButton}>Add</button>
            <input type="file" className={s.fileInput} />
            
            <h1>Your gallery</h1>
            <div className={s.gallery}>
                {images.map(image => (
                    <div key={image.id} className={s.imagePost}>
                        <img className={s.uploadedImage} src={image.src} alt={image.title} />
                        <button className={s.removeButton} onClick={() => removeImage(image.id)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPictures;
