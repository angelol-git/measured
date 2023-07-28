import { useState } from "react";
import React from "react";
import "./ActiveCard.css";

function ActiveCard(props) {
  const { active, category, title, imageSrc, measurements } = props.values;
  const [imageStatus, setImageStatus] = useState("");

  const [detailView, setDetailView] = useState(false);
  const activeButtonElement = active ? (
    <button
      className="primary-button inactive-button-color"
      onClick={() => props.handleActive(title.toUpperCase(), category)}
    >
      Set as Inactive
    </button>
  ) : (
    ""
  );
  const measurementElements = Object.entries(measurements).map(
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

  function handleImageLoad() {
    setImageStatus("success");
  }

  function handleClick() {
    setDetailView((detailView) => !detailView);
  }

  return (
    <div className="active-card text-normal" onClick={handleClick}>
      <div className="active-title-row">
        <div className="active-main">
          <p className="title bold-text">{title}</p>
          <p>{category}</p>
        </div>
        <img
          className="mini-thumbnail"
          src={
            imageStatus === "success" ? imageSrc : "./data/images/loading.gif"
          }
          onLoad={handleImageLoad}
          alt={title}
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
