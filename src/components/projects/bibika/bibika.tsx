import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import imageNamesArr from "../../../../public/images/Bibika/index.json";

const imagesFolderName = "Bibika";

const BibikaProjectPage = () => {
  const [images2, setImagesArr] = useState<Array<object>>([]);
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const tmpImages = imageNamesArr.files.map((x) => {
      original: `${process.env.PUBLIC_URL}/${x}`;
    });
  };
  const images = [
    {
      original: "/images/Bibika/add_1.jpg",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
    },
  ];

  return (
    <>
      {/* <ImageGallery
        items={images}
        showNav={false}
        autoPlay={true}
        showPlayButton={false}
        showFullscreenButton={false}
        showThumbnails={false}
        useTranslate3D={false}
      /> */}
      <img
        src="https://koval-portfolio.weebly.com/uploads/1/4/5/1/145117031/editor/logo-bibika.jpg?1679564945"
        alt="Project logo"
        className="project-logo-miniature"
      />
      <h1>Bibika</h1>
      <p className="project-description">
        This was a project completed as a team of four people during my time at
        the academy. I was the team leader, but also wrote code for both the
        frontend and backend. Our team had a dedicated designer who created the
        full UI/UX design. We also implemented a specific database architecture
        that allowed us to develop a detailed search system
      </p>
      <ul className="  project-stack">
        <li>
          .NET 6 <small>Clean architecture | Entity Framework Core</small>
        </li>
        <li>
          React 18 <small>Redux | Typescript | SASS</small>
        </li>
        <li>PostgreSQL</li>
      </ul>
    </>
  );
};

export default BibikaProjectPage;
