import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Add.css";
function Add(props) {
  const navigate = useNavigate();
  const [currentUnit, setCurrentUnit] = useState("in");
  const [currentCategory, setCurrentCategory] = useState("Tops");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentMeasurements, setCurrentMeasurements] = useState([]);
  //0 = Tops, Outerwear, 1 = Bottoms
  const measurementCategory = {
    Tops: ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
    Bottoms: ["Waist", "Inseam", "Leg Opening", "Front Rise", "Thigh", "Knee"],
    Outerwear: ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
  };
  const currentUnitIndex = currentUnit === "in" ? 0 : 1;
  const inchButtonClass =
    currentUnit === "in" ? " primary-button" : " secondary-button-color";
  const cmButtonClass =
    currentUnit === "in" ? " secondary-button-color" : " primary-button";

  const measurementElements = (
    <div className="measurement-container">
      {measurementCategory[currentCategory].map((item, index) => (
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
              value={currentMeasurements[item]?.[currentUnitIndex] || ""}
              min="0.00"
              step=".01"
              placeholder="0.00"
              onChange={handleUnitInput}
            />
            {currentUnit}
          </div>
        </div>
      ))}
    </div>
  );

  const titleErrorElement =
    props.titleError === true ? (
      <div className="title-error">
        <p className="error-text">Error {currentTitle} already exist</p>
      </div>
    ) : (
      ""
    );

  const tittleClassNames = props.titleError === true ? " error-border" : "";

  function handleCategoryChange(event) {
    const selectedCategory = event.target.value;
    setCurrentCategory(measurementCategory[selectedCategory]);
  }

  function handleTitle(event) {
    setCurrentTitle(event.target.value);
  }

  useEffect(() => {
    props.verifyTitle(currentTitle);
  }, [currentTitle]);

  function handleUnitClick() {
    const newUnit = currentUnit === "in" ? "cm" : "in";
    setCurrentUnit(newUnit);
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

    if (currentUnit === "in") {
      inchValue = value;
      cmValue = (inchValue * 2.54).toFixed(2);
    } else {
      cmValue = value;
      inchValue = (cmValue / 2.54).toFixed(2);
    }

    setCurrentMeasurements((currentMeasurements) => ({
      ...currentMeasurements,
      [name]: [inchValue, cmValue],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      category: event.target.category.value,
      title: event.target.title.value,
      size: event.target.size.value,
      imageSrc: event.target.image.value,
      active: event.target.active.checked,

      measurements: {},
    };

    for (let i = 0; i < measurementCategory[currentCategory].length; i++) {
      const categoryKey = measurementCategory[currentCategory][i];
      const categoryValue = [
        currentMeasurements[categoryKey][0],
        currentMeasurements[categoryKey][1],
      ];
      newItem.measurements[categoryKey] = categoryValue;
    }

    if (props.titleError === true) {
      return;
    }

    props.handleAddItem(newItem);
    props.handleActive(
      event.target.title.value.toUpperCase(),
      event.target.category.value,
      true
    );

    navigate("/items");
  }

  //Imperative
  function handleImagePreview(event) {
    let previewElement = document.getElementById("image-preview");
    if (event.target.value.length > 0) {
      previewElement.src = event.target.value;
      previewElement.classList.add("display-block");
    } else {
      previewElement.classList.remove("display-block");
    }
  }

  return (
    <div className="add-container">
      <div className="sub-row">
        <Link to="/items" className="position-left">
          <button className="back-button">←</button>
        </Link>
        <h3 className="bold-text header-medium">Add a new item</h3>
      </div>
      <form id="add-form" onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="title" className="bold-text">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={handleTitle}
            className={"input-text" + tittleClassNames}
            required
          />

          {titleErrorElement}
        </div>

        <div className="form-input">
          <label htmlFor="category" className="bold-text">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="input-category"
            onChange={handleCategoryChange}
          >
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Outerwear">Outerwear</option>
          </select>
        </div>

        <div className="form-input">
          <label htmlFor="size" className="bold-text">
            Size
          </label>
          <select name="size" id="size" className="input-category">
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>

        <div className="form-input">
          <label htmlFor="image" className="bold-text">
            Image
          </label>
          <input
            type="text"
            id="image"
            name="image"
            placeholder="Image URL"
            className="input-text"
            onChange={handleImagePreview}
          />
        </div>

        <div className="image-preview-container">
          <img
            id="image-preview"
            className="medium-thumbnail display-none"
          ></img>
        </div>
        <div>
          <label htmlFor="active">
            Set as active:
            <input type="checkbox" id="active" name="active" value="active" />
          </label>
        </div>
        <div>
          <div className="flex align-center justify-space-between">
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

        <input
          type="submit"
          value="Save"
          className="primary-button submit-button"
        />
      </form>
    </div>
  );
}

export default Add;
