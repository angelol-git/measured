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
        clickModal={clickModal}
        handleClickModal={handleClickModal}
        active={props.active}
        category={props.category}
        title={props.title}
        imageSrc={props.imageSrc}
        measurements={props.measurements}
        handleActive={props.handleActive}
        handleDeleteItem={props.handleDeleteItem}
      />
    </div>
  );
}
export default ItemCard;
