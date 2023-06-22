import { useState } from "react";
import React from "react";
import "./ItemCard.css";

function ItemCard(props) {
  const [hover, setHover] = useState(false);
  const toggleHover = () => setHover(!hover);
  let hoverView = "";

  return (
    <div
      className="item-card"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <img className="large-thumbnail" src={props.imageSrc}></img>
      <div className={"title-hover" + (hover ? " show" : "")}>
        <p>{props.title}</p>
      </div>
    </div>
  );
}
export default ItemCard;
