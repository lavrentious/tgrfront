import React, { useEffect } from "react";
import "./imageViewer.css";

interface Image {
  src: string;
  alt?: string;
}
interface ImageViewerProps {
  images: Image[];
  i: number;
  setI: (i: number) => void;
  setIsFullscreen: (v: boolean) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  i,
  setI,
  setIsFullscreen,
}) => {
  useEffect(() => {
    const listener: (this: Window, ev: KeyboardEvent) => void = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
      else if (e.key === "ArrowLeft")
        setI((i - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight")
        setI((i + 1 + images.length) % images.length);
    };
    addEventListener("keydown", listener);
    return () => {
      removeEventListener("keydown", listener);
    };
  });

  return (
    <div
      // ref={ref}
      className="viewable-image__backdrop"
      onClick={() => setIsFullscreen(false)}
      onKeyDownCapture={console.log}
      tabIndex={0}
    >
      <div className="viewable-image__img">
        <img {...images[i]} onClick={(e) => e.stopPropagation()} />
        <p className="viewable-image__title">{images[i].alt}</p>
      </div>
    </div>
  );
};

export default ImageViewer;
