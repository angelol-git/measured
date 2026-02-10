import { useState } from "react";
import "./ItemImage.css";

function ItemImage({ imageSrc, title, hover }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className={`item-image-container ${!isLoading ? "skeleton" : ""}`}>
      {imageSrc.length === 0 ? (
        <div className={"image-replacement" + (hover ? " darken-image" : "")}>
          <p>{title.split("")[0]}</p>
        </div>
      ) : (
        <img
          id="image"
          className={"full-cover-thumbnail" + (hover ? " darken-image" : "")}
          src={imageSrc}
          onLoad={() => setIsLoading(true)}
          alt={`Thumbnail of ${title}`}
        />
      )}
    </div>
  );
}
export default ItemImage;
