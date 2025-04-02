import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";

const ImageLoaderComponent = ({
  url,
  hashCode,
  alt,
  className,
  blurWidth = "400px",
  blurHeight = "400px",
  rounded,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = url;
  }, [url]);

  const roundedStyle = {
    borderRadius: "100%",
    overflow: "hidden",
    width: blurWidth,
    height: blurHeight,
  };

  return (
    <>
      {imageLoaded ? (
        <img src={url} alt={alt} className={className} />
      ) : rounded ? (
        <div style={roundedStyle}>
          <Blurhash
            hash={hashCode}
            width={blurWidth}
            height={blurHeight}
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      ) : (
        <Blurhash
          hash={hashCode}
          width={blurWidth}
          height={blurHeight}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
    </>
  );
};

export default ImageLoaderComponent;
