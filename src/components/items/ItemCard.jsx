import React from "react";
import { useState } from "react";
import ItemModal from "./ItemModal";
import "./ItemCard.css";

function ItemCard(props) {
  const [clickModal, setClickModal] = useState(false);
  const [hover, setHover] = useState(false);
  const [imageStatus, setImageStatus] = useState("");
  const toggleHover = () => setHover(!hover);

  function handleClickModal() {
    setClickModal(!clickModal);
  }
  function handleImageLoad() {
    setImageStatus("success");
  }
  return (
    <div>
      <div
        className="item-card black-border"
        onClick={handleClickModal}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <img
          id="image"
          className={"medium-thumbnail" + (hover ? " darken-image" : "")}
          src={
            imageStatus === "success"
              ? props.imageSrc
              : "./data/images/loading.gif"
          }
          onLoad={handleImageLoad}
          alt={props.title}
        ></img>
        <div
          className={
            "title-hover text-medium bold-text" + (hover ? " show" : "")
          }
        >
          <p>{props.title}</p>
        </div>
        <div
          className={"active-tag text-normal" + (props.active ? " show" : "")}
        >
          <p>Active</p>
        </div>
      </div>
      <ItemModal
        key={props.title}
        title={props.title}
        category={props.category}
        active={props.active}
        size={props.size}
        imageSrc={props.imageSrc}
        measurements={props.measurements}
        clickModal={clickModal}
        handleClickModal={handleClickModal}
        handleActive={props.handleActive}
        handleDeleteItem={props.handleDeleteItem}
        handleUpdate={props.handleUpdate}
        verifyTitle={props.verifyTitle}
        titleError={props.titleError}
      />
    </div>
  );
}
export default ItemCard;
