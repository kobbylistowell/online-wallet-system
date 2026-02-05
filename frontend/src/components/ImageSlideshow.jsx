import { useEffect, useState } from "react";
import slide1 from "../assets/slides/slide1.jpg";
import slide2 from "../assets/slides/slide2.jpg";
import slide3 from "../assets/slides/slide3.jpg";
import slide4 from "../assets/slides/slide4.jpg";

const images = [slide1, slide2, slide3, slide4];

export default function ImageSlideshow({ children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slideshow-wrapper">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`slide-${i}`}
          className={i === index ? "active" : ""}
        />
      ))}

      <div className="slideshow-content">{children}</div>
    </div>
  );
}
