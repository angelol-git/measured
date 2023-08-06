import React from "react";
import { useState } from "react";
import ItemModal from "./ItemModal";
import "./ItemCard.css";

function ItemCard(props) {
  const { active, title, imageSrc } = props.values;
  const [clickModal, setClickModal] = useState(false);
  const [hover, setHover] = useState(false);
  const [imageStatus, setImageStatus] = useState("");
  const toggleHover = () => setHover(!hover);
  let imageElement;

  function handleClickModal() {
    setClickModal(!clickModal);
  }
  function handleImageLoad() {
    setImageStatus("success");
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
        alt={title}
      ></img>
    );
  }
  return (
    <div>
      <div
        className="item-card black-border"
        onClick={handleClickModal}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        {imageElement}
        <div
          className={
            "title-hover text-medium bold-text" + (hover ? " show" : "")
          }
        >
          <p>{title}</p>
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
    </div>
  );
}
export default ItemCard;
