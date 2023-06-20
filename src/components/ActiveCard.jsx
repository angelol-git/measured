import React from "react";

import "./ActiveCard.css";

function ActiveCard(props) {
  return (
    <div className="active-card">
      <div className="active-row">
        <p>{props.title}</p>
        <p className="description">{props.description}</p>
        <img className="mini-thumbnail" src={props.imageSrc}></img>
      </div>
    </div>
  );
}
export default ActiveCard;
