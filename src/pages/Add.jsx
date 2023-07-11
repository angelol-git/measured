import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Add.css";
function Add(props) {
  const [currentUnit, setCurrentUnit] = useState("in");
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentMeasurements, setCurrentMeasurements] = useState([]);
  //0 = Tops, Outerwear, 1 = Bottoms
  const measurementCategory = [
    ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
    ["Waist", "Inseam", "Leg Opening", "Front Rise", "Thigh", "Knee"],
  ];
  const currentUnitIndex = currentUnit === "in" ? 0 : 1;
  const inchButtonClass =
    currentUnit === "in" ? " primary-button" : " secondary-button-color";
  const cmButtonClass =
    currentUnit === "in" ? " secondary-button-color" : " primary-button";

  const titleErrorElement =
    props.titleError === true ? (
      <div className="title-error">
        <p className="error-text">Error {currentTitle} already exist</p>
      </div>
    ) : (
      ""
    );

  const tittleClassNames = props.titleError === true ? "error-border" : "";
  function handleCategoryChange(event) {
    const selectedCategory = event.target.value;
    if (selectedCategory === "Tops" || selectedCategory == "Outerwear") {
      setCurrentCategory(0);
    } else {
      setCurrentCategory(1);
    }
  }

  function handleUnitClick() {
    const newUnit = currentUnit === "in" ? "cm" : "in";
    setCurrentUnit(newUnit);
  }

  function handleTitle(event) {
    setCurrentTitle(event.target.value);
  }

  useEffect(() => {
    props.verifyTitle(currentTitle);
  }, [currentTitle]);

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      category: event.target.category.value,
      title: event.target.title.value,
      size: event.target.size.value,
      imageSrc: event.target.image.value,
      active: event.target.active.checked,

      measurements: {
        Chest: [
          currentMeasurements["Chest"][0],
          currentMeasurements["Chest"][1],
        ],
        Length: [
          currentMeasurements["Length"][0],
          currentMeasurements["Length"][1],
        ],
        Shoulders: [
          currentMeasurements["Shoulders"][0],
          currentMeasurements["Shoulders"][1],
        ],
        "Sleeve Length": [
          currentMeasurements["Sleeve Length"][0],
          currentMeasurements["Sleeve Length"][1],
        ],
        Hem: [currentMeasurements["Hem"][0], currentMeasurements["Hem"][1]],
      },
    };

    if (props.titleError === true) {
      return;
    }
    props.handleAddItem(newItem);
    window.location.replace("/");
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
      [name]: [[inchValue], [cmValue]],
    }));
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

  const measurementElements = (
    <div className="measurement-container">
      {measurementCategory[currentCategory].map((item, index) => (
        <div className="unit-input-row" key={index}>
          <label htmlFor={`${item}`} className="text-medium">
            {item}
          </label>
          <div>
            <input
              type="number"
              id={`${item}`}
              name={`${item}`}
              className="unit-input"
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

  return (
    <div className="add-container">
      <div className="sub-row">
        <Link
          to="/items"
          className="secondary-link-color back-button position-left"
        >
          ←
        </Link>
        <h3 className="bold-text header-medium">Add a new item</h3>
      </div>
      <form
        id="add-form"
        className="flex-column gap-5 text-medium"
        onSubmit={handleSubmit}
      >
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          onChange={handleTitle}
          className={tittleClassNames}
          required
        />
        {titleErrorElement}
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          className="category text-medium"
          onChange={handleCategoryChange}
        >
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Outerwear">Outerwear</option>
        </select>

        <label htmlFor="size">Size</label>
        <select name="size" id="size" className="category text-medium">
          <option value="s">S</option>
          <option value="m">M</option>
          <option value="l">L</option>
        </select>

        <label htmlFor="image">Image</label>
        <input
          type="text"
          id="image"
          name="image"
          placeholder="Image URL"
          className="flex image-input"
          onChange={handleImagePreview}
        />
        <div className="image-preview-container">
          <img
            id="image-preview"
            className="medium-thumbnail display-none"
          ></img>
        </div>
        <div
          className="flex align-center
        "
        >
          <label htmlFor="active"> Set as active: </label>
          <input type="checkbox" id="active" name="active" value="active" />
        </div>
        <div>
          <div className="flex align-center justify-space-between">
            <label>Measurements</label>
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
