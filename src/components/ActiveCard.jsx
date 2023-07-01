import { useState } from "react";
import React from "react";
import "./ActiveCard.css";

function ActiveCard(props) {
  const [detailView, setDetailView] = useState(false);
  const activeButtonElement = props.active ? (
    <button className="main-button text-normal">Set as not Active</button>
  ) : (
    ""
  );
  const measurementElements = Object.entries(props.measurements).map(
    ([key, values]) => (
      <div className="flex" key={key}>
        <p className="measurement-header bold-text">{key}:</p>
        <div className="measurement-value">
          <div className="measurement-value-container">
            <p>{values[0]}</p>
            <p>in</p>
          </div>
          <div className="measurement-value-container">
            <p>{values[1]}</p>
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
    <div className="active-card text-normal" onClick={handleClick}>
      <div className="active-title-row">
        <div className="active-main">
          <p className="title bold-text">{props.title}</p>
          <p>{props.category}</p>
        </div>
        <img
          className="mini-thumbnail"
          src={"public/data/images/" + props.imageSrc}
        ></img>
      </div>
      <div className={"active-details" + (detailView ? " show" : "")}>
        {measurementElements}
        <div className="active-button-row">{activeButtonElement}</div>
      </div>
    </div>
  );
}
export default ActiveCard;
