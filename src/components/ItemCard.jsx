import { useState } from "react";
import React from "react";
import ItemDetail from "./ItemModal";
import "./ItemCard.css";

function ItemCard(props) {
  const [clickDetail, setClickDetail] = useState(false);
  const [hover, setHover] = useState(false);
  const toggleHover = () => setHover(!hover);

  function handleClickDetail() {
    setClickDetail(!clickDetail);
  }
  return (
    <div>
      <div
        className="item-card black-border"
        onClick={handleClickDetail}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <img
          className={"medium-thumbnail" + (hover ? " darken-image" : "")}
          src={"public/data/images/" + props.imageSrc}
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
      <ItemDetail
        key={props.title}
        clickDetail={clickDetail}
        handleClickDetail={handleClickDetail}
        active={props.active}
        category={props.category}
        title={props.title}
        imageSrc={props.imageSrc}
        measurements={props.measurements}
      />
    </div>
  );
}
export default ItemCard;
