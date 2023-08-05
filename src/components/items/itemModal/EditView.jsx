import React from "react";
import { useState, useEffect } from "react";
import "./EditView.css";

function EditView(props) {
  const { active, category, title, size, imageSrc, measurements } =
    props.values;
  const { handleTitle, titleError, handleUpdate } = props.handleFunctions;
  const prevTitle = title;
  const prevCategory = category;
  const [currActive, setActive] = useState(active);
  const [currCategory, setCategory] = useState(prevCategory);
  const [currTitle, setTitle] = useState(title);
  const [currImageSrc, setImageUrl] = useState(imageSrc);
  const [currSize, setSize] = useState(size);
  const [currMeasurements, setMeasurements] = useState(measurements);
  const [imageStatus, setImageStatus] = useState("");

  const measurementCategory = {
    Tops: ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
    Bottoms: ["Waist", "Inseam", "Leg Opening", "Front Rise", "Thigh", "Knee"],
    Outerwear: ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
  };
  const [unit, setUnit] = useState("in");
  const unitIndex = unit === "in" ? 0 : 1;
  const inchButtonClass =
    unit === "in" ? " primary-button" : " secondary-button-color";
  const cmButtonClass =
    unit === "in" ? " secondary-button-color" : " primary-button";

  const measurementElements = (
    <div className="measurement-container">
      {measurementCategory[category].map((item, index) => (
        <div className="unit-input-row" key={index}>
          <label htmlFor={`${item}`} className="text-normal">
            {item}
          </label>
          <div>
            <input
              type="number"
              id={`${item}`}
              name={`${item}`}
              className="unit-input text-normal"
              value={currMeasurements[item]?.[unitIndex] || ""}
              min="0.00"
              step=".01"
              placeholder="0.00"
              onChange={handleUnitInput}
            />
            {unit}
          </div>
        </div>
      ))}
    </div>
  );

  function handleUnitClick() {
    const newUnit = unit === "in" ? "cm" : "in";
    setUnit(newUnit);
  }
  function handleUnitInput(event) {
    const { name, value } = event.target;
    let inchValue = 0;
    let cmValue = 0;

    if (value.includes(".")) {
      if (value.split(".")[1].length > 2) {
        return;
      }
    }

    if (unit === "in") {
      inchValue = value;
      cmValue = (inchValue * 2.54).toFixed(2);
    } else {
      cmValue = value;
      inchValue = (cmValue / 2.54).toFixed(2);
    }

    setMeasurements((prevMeasurements) => ({
      ...prevMeasurements,
      [name]: [inchValue, cmValue],
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    const newItem = {
      category: currCategory,
      title: currTitle,
      size: currSize,
      imageSrc: currImageSrc,
      active: currActive,
      measurements: {},
    };

    for (let i = 0; i < measurementCategory[category].length; i++) {
      const categoryKey = measurementCategory[category][i];
      console.log(measurements);
      if (currMeasurements[categoryKey] === undefined) {
        continue;
      }
      const categoryValue = [
        currMeasurements[categoryKey][0],
        currMeasurements[categoryKey][1],
      ];
      newItem.measurements[categoryKey] = categoryValue;
    }

    if (titleError === true) {
      return;
    }

    handleUpdate(newItem, prevTitle.toUpperCase());
    props.handleEditBack();
  }

  function handleImageLoad() {
    setImageStatus("success");
  }
  function handleImageError() {
    setImageStatus("error");
  }

  function handleImageChange(event) {
    setImageStatus("loading");
    setImageUrl(event.target.value);
  }

  useEffect(() => {
    handleTitle(currTitle, prevTitle);
  }, [currTitle]);

  const titleErrorElement =
    titleError === true ? (
      <div className="title-error">
        <p className="error-text">Error {currTitle} already exists.</p>
      </div>
    ) : (
      ""
    );

  return (
    <section className="modal-container">
      <div className="inner-container">
        <div className="sub-row">
          <button
            className="back-button secondary-link-color position-left"
            onClick={() => {
              props.handleClickModal;
              props.handleEditBack();
            }}
          >
            ←
          </button>
          <h3 className="bold-text header-medium">Edit item</h3>
        </div>
        <form id="edit-form" className="text-normal" onSubmit={handleSave}>
          <div className="image-preview-container">
            {currImageSrc.length !== 0 ? (
              <div className="image-preview-container">
                {imageStatus !== "error" && (
                  <div className="image-container">
                    <img
                      id="image"
                      src={
                        imageStatus === "success"
                          ? currImageSrc
                          : "./data/images/loading.gif"
                      }
                      className="medium-thumbnail"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            <div className="form-row">
              <label htmlFor="image" className="bold-text">
                Image:{" "}
              </label>
              <input
                type="text"
                id="image"
                name="image"
                placeholder="Image URL"
                value={currImageSrc}
                className="text-normal form-input"
                onChange={handleImageChange}
              />
            </div>

            {imageStatus === "error" ? (
              <p className="error-text">Image cannot be found </p>
            ) : (
              ""
            )}
          </div>

          <div className="form-row">
            <label htmlFor="html" className="bold-text">
              Title:{" "}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={currTitle}
              className="text-normal form-input"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          {titleErrorElement}
          <div className="edit-grey-line"></div>
          <div className="form-row gap-15">
            <div className="flex align-center gap-5">
              <label htmlFor="category" className="bold-text">
                Category:
              </label>
              <select
                name="category"
                id="category"
                className="category"
                defaultValue={currCategory}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
              </select>
            </div>
            <div className="flex align-center gap-5">
              <label htmlFor="size" className="bold-text">
                Size:
              </label>
              <select
                name="size"
                id="size"
                className="size"
                defaultValue={currSize}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>
          <div className="edit-measurement-container">
            <div className="form-row justify-space-between">
              <label className="bold-text">Measurements</label>
              <div>
                <button
                  type="button"
                  className={"primary-button black-border" + inchButtonClass}
                  onClick={handleUnitClick}
                >
                  Inch
                </button>
                <button
                  type="button"
                  className={"primary-button black-border" + cmButtonClass}
                  onClick={handleUnitClick}
                >
                  Cm
                </button>
              </div>
            </div>
            {measurementElements}
          </div>

          <div>
            <input
              type="submit"
              value="Save"
              className="primary-button submit-button"
              onClick={handleSave}
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditView;
