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
      tabindex={props.customTabIndex + 2}
    >
      Set as Inactive
    </button>
  ) : (
    ""
  );
  const measurementElements = Object.entries(measurements).map(
    ([key, values]) => (
      <div className="flex" key={key}>
        <p className="measurement-header">{key}:</p>
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
  function handleKeyDown(event) {
    console.log("here");
    if (event.key === "Enter") {
      setDetailView((detailView) => !detailView);
    }
  }

  return (
    <article
      className="active-card text-normal"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-pressed={detailView}
      tabindex={props.customTabIndex + 1}
    >
      <header className="active-title-row">
        <div className="active-main">
          <h2 className="title bold-text">{title}</h2>
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
      </header>
      <section className={"active-details" + (detailView ? " show" : "")}>
        <div className="active-measurement-container">
          {" "}
          {measurementElements}
        </div>
        <footer className="active-button-row">{activeButtonElement}</footer>
      </section>
    </article>
  );
}
export default ActiveCard;
