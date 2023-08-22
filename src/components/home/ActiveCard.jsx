import { useState } from "react";
import React from "react";
import "./ActiveCard.css";

function ActiveCard(props) {
  const { active, category, title, imageSrc, measurements } = props.values;
  const [imageStatus, setImageStatus] = useState("");
  const [detailView, setDetailView] = useState(false);
  let imageElement;
  const activeButtonElement = active ? (
    <button
      className="primary-button inactive-button-color"
      onClick={() => props.handleActive(title.toUpperCase(), category)}
      tabIndex={props.fullModalOpen}
    >
      Set as Inactive
    </button>
  ) : (
    ""
  );
  const measurementElements = Object.entries(measurements).map(
    ([key, values]) => (
      <div className="flex" key={key}>
        <p className="measurement-label">{key}:</p>
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

  if (imageSrc.length === 0) {
    const firstTitleLetter = title.split("")[0];
    imageElement = (
      <div
        className={
          "image-replacement image-replacement-active-card mini-thumbnail"
        }
      >
        <p>{firstTitleLetter}</p>
      </div>
    );
  } else {
    imageElement = (
      <img
        className="mini-thumbnail"
        src={imageStatus === "success" ? imageSrc : "./data/images/loading.gif"}
        onLoad={handleImageLoad}
        alt={title}
      ></img>
    );
  }
  function handleImageLoad() {
    setImageStatus("success");
  }

  function handleClick() {
    setDetailView((detailView) => !detailView);
  }
  function handleKeyDown(event) {
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
      aria-expanded={detailView}
      tabIndex={props.fullModalOpen}
    >
      <header className="active-header">
        <div className="active-title-container">
          <h2 className="active-title bold-text">{title}</h2>
          <p>{category}</p>
        </div>
        {imageElement}
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
