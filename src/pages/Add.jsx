import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./Add.css";
function Add() {
  const [currentUnit, setCurrentUnit] = useState("in");
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentMeasurements, setCurrentMeasurements] = useState([]);
  const measurementCategory = [
    ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
    ["Waist", "Inseam", "Leg Opening", "Front Rise", "Thigh", "Knee"],
  ];
  const currentUnitIndex = currentUnit === "in" ? 0 : 1;
  const inchButtonClass =
    currentUnit === "in" ? " primary-button" : " secondary-button-color";
  const cmButtonClass =
    currentUnit === "in" ? " secondary-button-color" : " primary-button";

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

  function handleSubmit(event) {
    event.preventDefault();
    console.log(currentMeasurements);
    // redirect();
  }

  function handleUnitInput(event) {
    const { name, value } = event.target;
    let inchValue = 0;
    let cmValue = 0;

    console.log(typeof value);

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
              min="0"
              max="99.99"
              step=".01"
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
        className="flex-column gap-5 text-medium"
        onSubmit={(event) => handleSubmit(event)}
      >
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          form="category-form"
          className="category text-medium"
          onChange={(event) => handleCategoryChange(event)}
        >
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Outerwear">Outerwear</option>
        </select>

        <label htmlFor="image">Image</label>
        <input type="file" id="image" name="image" accept="image/*" />

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
