import React, { createContext, useState } from "react";
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

  return (
    <ImagesContext.Provider value={{ images, setImages }}>
      {children}
    </ImagesContext.Provider>
  );
};
