import { useState } from "react";
import React from "react";
import "./ItemCard.css";

function ActiveCard(props) {
  const [detailView, setDetailView] = useState(false);

  function handleClick() {
    setDetailView((detailView) => !detailView);
  }

  return (
    <div className="item-card" onClick={handleClick}>
      <img className="large-thumbnail" src={props.imageSrc}></img>
      <div className=""></div>
    </div>
  );
}
export default ActiveCard;
