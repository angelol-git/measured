import React from "react";
import { useState } from "react";
import ItemModal from "./ItemModal";
import "./ItemCard.css";

function ItemCard(props) {
  const { active, title, imageSrc } = props.values;
  const [clickModal, setClickModal] = useState(false);
  const [hover, setHover] = useState(false);
  const [imageStatus, setImageStatus] = useState("");
  let imageElement;

  function handleHover() {
    setClickModal(!hover);
  }
  function handleClickModal() {
    setClickModal(!clickModal);
  }
  function handleImageLoad() {
    setImageStatus("success");
  }

  function handleKeyDown(event) {
    console.log("here");
    if (event.key === "Enter") {
      setClickModal(!clickModal);
    }
  }

  if (imageSrc.length === 0) {
    const firstTitleLetter = title.split("")[0];
    imageElement = (
      <div className={"image-replacement" + (hover ? " darken-image" : "")}>
        <p>{firstTitleLetter}</p>
      </div>
    );
  } else {
    imageElement = (
      <img
        id="image"
        className={"medium-thumbnail" + (hover ? " darken-image" : "")}
        src={imageStatus === "success" ? imageSrc : "./data/images/loading.gif"}
        onLoad={handleImageLoad}
        alt={`Thumbnail of ${title}`}
      ></img>
    );
  }
  return (
    <article>
      <div
        className="item-card black-border"
        onClick={handleClickModal}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        onFocus={handleHover}
        onBlur={handleHover}
        role="button"
        aria-label="Open item details"
        aria-pressed={clickModal}
        tabIndex={0}
      >
        {imageElement}
        <div className={"title-hover" + (hover ? " show" : "")}>
          <h2 className="text-medium bold-text">{title}</h2>
        </div>
        <div className={"active-tag text-normal" + (active ? " show" : "")}>
          <p>Active</p>
        </div>
      </div>
      <ItemModal
        key={title}
        values={props.values}
        clickModal={clickModal}
        handleClickModal={handleClickModal}
        handleFunctions={props.handleFunctions}
        settingsData={props.settingsData}
      />
    </article>
  );
}
export default ItemCard;
