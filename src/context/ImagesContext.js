import React, { createContext, useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import picture1 from "../../src/components/images/images_profile1/picture1.png";
import picture2 from "../../src/components/images/images_profile1/picture2.png";
import picture3 from "../../src/components/images/images_profile1/picture3.png";
import picture4 from "../../src/components/images/images_profile1/picture4.png";
import picture5 from "../../src/components/images/images_profile1/picture5.png";
import picture6 from "../../src/components/images/images_profile1/picture6.png";
import picture7 from "../../src/components/images/images_profile1/picture7.png";
import picture8 from "../../src/components/images/images_profile1/picture8.png";
import picture9 from "../../src/components/images/images_profile1/picture9.png";
import picture10 from "../../src/components/images/images_profile1/picture10.png";
import picture11 from "../../src/components/images/images_profile1/picture11.png";
import picture12 from "../../src/components/images/images_profile1/picture12.png";
import picture13 from "../../src/components/images/images_profile1/picture13.png";
import picture14 from "../../src/components/images/images_profile1/picture14.png";

export const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
  const [firebaseImages, setFirebaseImages] = useState([]);
  const staticImages = [
    { id: 1, src: picture1, title: "Nature and bridge", description: "Nature and bridge" },
    { id: 2, src: picture2, title: "Beautiful mountain", description: "Beautiful mountain" },
    { id: 3, src: picture3, title: "Land and sun", description: "Land and sun" },
    { id: 4, src: picture4, title: "Forest with sun light", description: "Forest with sun light" },
    { id: 5, src: picture5, title: "Plant with sun", description: "Plant with sun" },
    { id: 6, src: picture6, title: "Mountain forest", description: "Mountain forest" },
    { id: 7, src: picture7, title: "Nature and bridge", description: "Mountain forest" },
    { id: 8, src: picture8, title: "Nature and bridge", description: "Mountain forest" },
    { id: 9, src: picture9, title: "Nature and bridge", description: "Mountain forest" },
    { id: 10, src: picture10, title: "Nature and bridge", description: "Mountain forest" },
    { id: 11, src: picture11, title: "Nature and bridge", description: "Mountain forest" },
    { id: 12, src: picture12, title: "Nature and bridge", description: "Mountain forest" },
    { id: 13, src: picture13, title: "Nature and bridge", description: "Mountain forest" },
    { id: 14, src: picture14, title: "Nature and bridge", description: "Mountain forest" },
  ];

  function safeString(value) {
    return typeof value === "string" ? value : "";
  }

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, "pictures"));
      const allPictures = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let ownerData = {};
          
          if (data.ownerId) {
            try {
              const ownerSnap = await getDoc(doc(db, "users", data.ownerId));
              if (ownerSnap.exists()) {
                ownerData = ownerSnap.data();
              }
            } catch (err) {
              console.error("Error fetching owner:", err);
            }
          }

          return {
            id: docSnap.id,
            src: data.imageUrl,
            title: safeString(data.title),
            description: safeString(data.description),
            ownerId: safeString(data.ownerId),
            ownerName: `${safeString(ownerData.name)} ${safeString(ownerData.lastname)}`.trim(),
            ownerAvatar: safeString(ownerData.avatarUrl),
            createdAt: data.createdAt?.toDate?.() || new Date(0),
          };
        })
      );

      try {
      const response = await fetch("https://api.thedogapi.com/v1/breeds", {
        headers: {
          "x-api-key": "live_wd0uTdKVHHpN72u0N60qoTocG7mp7c7rkTmoiuNxcGaCHHNJMWPGzqBOXitybFmE"
        }
      });
      const dogBreeds = await response.json();

      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const uniqueBreedsByLetter = [];
      for (const letter of alphabet) {
        const breed = dogBreeds.find(
          (b) =>
            b.name &&
            b.name.toUpperCase().startsWith(letter) &&
            b.image &&
            b.image.url
        );

        if (breed) {
          uniqueBreedsByLetter.push({
            id: `dog-${letter}`,
            src: breed.image.url,
            title: safeString(breed.name),
            description: safeString(breed.temperament) || "No description",
            ownerId: null,
            ownerName: "Dog software from thedogapi.com",
            ownerAvatar: "",
          });
        }
      }

      setFirebaseImages([...allPictures, ...uniqueBreedsByLetter]);
    } catch (error) {
      console.error("Dog API fetch error:", error);
      setFirebaseImages(allPictures);
    }
    };

    fetchImages();
  }, []);



  const allImages = [...staticImages, ...firebaseImages];

  return (
    <ImagesContext.Provider value={{ staticImages, firebaseImages, setFirebaseImages, allImages }}>
      {children}
    </ImagesContext.Provider>
  );
};
