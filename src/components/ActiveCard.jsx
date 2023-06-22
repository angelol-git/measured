import { useState } from "react";
import React from "react";
import "./ActiveCard.css";

function ActiveCard(props) {
  const [detailView, setDetailView] = useState(false);
  const detailsClass = detailView ? " show" : "";
  console.log(detailsClass);
  const measurementElements = () => {
    return (
      <div>
        {Object.entries(props.measurements).map(([key, values]) => (
          // <p key={key}>
          //   <strong>{key}:</strong> {values.join(" / ")}
          // </p>
          <p>{key}</p>
        ))}
      </div>
    );
  };

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
      <div className={"active-details" + detailsClass}>
        {Object.entries(props.measurements).map(([key, values]) => (
          <p key={key}>
            <strong>{key}:</strong> {values.join(" / ")}
          </p>
        ))}
      </div>
    </div>
  );
}
export default ActiveCard;
