import { useState } from "react";
import "./ItemImage.css";

function ItemImage({ imageSrc, title }) {
  const [isLoading, setIsLoading] = useState(imageSrc ? false : true);
  console.log(isLoading);
  return (
    <div className={`item-image-container ${!isLoading ? "skeleton" : ""}`}>
      {imageSrc.length === 0 ? (
        <div className="image-replacement">
          <p>{title.split("")[0]}</p>
        </div>
      ) : (
        <img
          id="image"
          className="full-cover-thumbnail"
          src={imageSrc}
          onLoad={() => setIsLoading(true)}
          alt={`Thumbnail of ${title}`}
        />
      )}
    </div>
  );
}
export default ItemImage;
