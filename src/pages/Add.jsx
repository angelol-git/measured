import React from "react";
import { useState } from "react";

import { Link } from "react-router-dom";

import "./Add.css";
function Add() {
  const [inchDisplay, setInchDisplay] = useState(true);
  const unitDisplay = inchDisplay ? "in" : "cm";
  const inchButtonClass = inchDisplay ? " black-button" : " white-button";
  const cmButtonClass = inchDisplay ? " white-button" : " black-button";

  function handleCategoryChange() {
    if (event.target.value === "Tops") {
    }
  }

  function handleUnitClick() {
    setInchDisplay(!inchDisplay);
  }
  const measurementElements = (
    <div className="flex-column gap-5 measurement-container text-medium">
      <div className="unit-input-row">
        <p>Chest</p>
        <div className="flex align-center gap-5">
          <input type="number" id="chest-inch" name="chest-inch" min="0" />
          <p>{unitDisplay}</p>
        </div>
      </div>
      <div className="unit-input-row">
        <p>Length</p>
        <div className="flex align-center gap-5">
          <input
            type="number"
            id="length-inch"
            name="length-inch"
            className="unit-input"
            min="0"
          />
          <p>{unitDisplay}</p>
        </div>
      </div>
      <div className="unit-input-row">
        <p>Shoulders</p>
        <div className="flex align-center gap-5">
          <input
            type="number"
            id="shoulders-inch"
            name="shoulders-inch"
            className="unit-input"
            min="0"
          />
          <p>{unitDisplay}</p>
        </div>
      </div>

      <div className="unit-input-row">
        <p>Sleeve Length</p>
        <div className="flex align-center gap-5">
          <input
            type="number"
            id="sleeve-inch"
            name="sleeve-inch"
            className="unit-input"
            min="0"
          />
          <p>{unitDisplay}</p>
        </div>
      </div>
      <div className="unit-input-row">
        <p>Hem</p>
        <div className="flex align-center gap-5">
          <input
            type="number"
            id="hem-inch"
            name="hem-inch"
            className="unit-input"
            min="0"
          />
          <p>{unitDisplay}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="add-container">
      <div className="sub-row">
        <button className="back-button position-left">
          <Link to="/items" className="secondary-link-color">
            ←
          </Link>
        </button>
        <h3 className="bold-text header-medium">Add a new item</h3>
      </div>
      <form className="flex-column gap-5 text-large">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          form="category-form"
          className="category"
          onChange={handleCategoryChange}
        >
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Outerwear">Outerwear</option>
        </select>

        <label htmlFor="image">Image</label>
        <input type="file" id="image" name="image" accept="image/*" />

        <div className="measurement-container">
          <div className="flex align-center justify-space-between">
            <p>Measurements</p>
            <div>
              <button
                type="button"
                className={"main-button black-border" + inchButtonClass}
                onClick={handleUnitClick}
              >
                Inch
              </button>
              <button
                type="button"
                className={"main-button black-border" + cmButtonClass}
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
          className="main-button black-button submit-button"
        />
      </form>
    </div>
  );
}

export default Add;
