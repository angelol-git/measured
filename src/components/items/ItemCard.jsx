import React from "react";
import { useState } from "react";
import ItemModal from "./ItemModal";
import "./ItemCard.css";

function ItemCard(props) {
  const [clickModal, setClickModal] = useState(false);
  const [hover, setHover] = useState(false);
  const toggleHover = () => setHover(!hover);

  function handleClickModal() {
    setClickModal(!clickModal);
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
          className={"medium-thumbnail" + (hover ? " darken-image" : "")}
          src={props.imageSrc}
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
