import { useState } from "react";
import React from "react";
import "./ActiveCard.css";

function ActiveCard(props) {
  const [detailView, setDetailView] = useState(false);

  const measurementElements = Object.entries(props.measurements).map(
    ([key, values]) => (
      <div className="detail-row" key={key}>
        <p className="detail-header bold-text">{key}:</p>
        <div className="detail-measurements">
          <div className="detail-container">
            <p className="detail-value">{values[0]}</p>
            <p>in</p>
          </div>
          <div className="detail-container">
            <p className="detail-value">{values[1]}</p>
            <p>cm</p>
          </div>
        </div>
      </div>
    )
  );

  function handleClick() {
    setDetailView((detailView) => !detailView);
  }

  return (
    <div className="active-card" onClick={handleClick}>
      <div className="active-row">
        <div className="active-main">
          <p className="bold-text">{props.category}</p>
          <p className="title">{props.title}</p>
        </div>
        <img className="mini-thumbnail" src={props.imageSrc}></img>
      </div>
      <div className={"active-details" + (detailView ? " show" : "")}>
        {measurementElements}
      </div>
    </div>
  );
}
export default ActiveCard;
