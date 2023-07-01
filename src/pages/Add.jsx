import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./Add.css";
function Add() {
  const [inchDisplay, setInchDisplay] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(0);
  const measurementCategory = [
    ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
    ["Waist", "Inseam", "Leg Opening", "Front Rise", "Thigh", "Knee"],
  ];
  const unitDisplay = inchDisplay ? "in" : "cm";
  const inchButtonClass = inchDisplay
    ? " primary-button"
    : " secondary-button-color";
  const cmButtonClass = inchDisplay
    ? " secondary-button-color"
    : " primary-button";

  function handleCategoryChange(event) {
    const selectedCategory = event.target.value;
    if (selectedCategory === "Tops" || selectedCategory == "Outerwear") {
      setCurrentCategory(0);
    } else {
      setCurrentCategory(1);
    }
  }

  function handleUnitClick() {
    setInchDisplay(!inchDisplay);
  }

  const measurementElements = (
    <div className="flex-column gap-5 measurement-container">
      {measurementCategory[currentCategory].map((item, index) => (
        <div className="unit-input-row" key={index}>
          <label htmlFor={`${item.toLowerCase()}`} className="text-medium">
            {item}
          </label>
          <div>
            <input
              type="number"
              id={`${item.toLowerCase()}`}
              name={`${item.toLowerCase()}`}
              className="unit-input"
              min="0"
            />
            {unitDisplay}
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
      <form className="flex-column gap-5 text-medium">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
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
