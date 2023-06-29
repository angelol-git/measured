import React from "react";
import { Link } from "react-router-dom";

import "./Add.css";
function Add() {
  const measurementElements = (
    <div>
      <div>
        <p>Chest</p>
        <input type="text" id="chest-inch" name="chest-inch" />
      </div>
      <div>
        <p>Length</p>
        <input type="text" id="length-inch" name="length-inch" />
      </div>
      <div>
        <p>Shoulders</p>
        <input type="text" id="shoulders-inch" name="shoulders-inch" />
      </div>
      <div>
        <p>Sleeve Length</p>
        <input type="text" id="sleeve-inch" name="sleeve-inch" />
      </div>
      <div>
        <p>Hem</p>
        <input type="text" id="hem-inch" name="hem-inch" />
      </div>
    </div>
  );
  function handleCategoryChange() {
    if (event.target.value === "Tops") {
    }
  }
  return (
    <div className="add-container">
      <div className="add-title-row">
        <button className="back-button">
          <Link to="/items" className="secondary-link-color">
            ←
          </Link>
        </button>
        <h3>Add a new item</h3>
      </div>
      <form className="add-form">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          form="category-form"
          onChange={handleCategoryChange}
        >
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Outerwear">Outerwear</option>
        </select>
        <p>Measurements</p>
        <div className="button-row">
          <button className="primary-button primary-button-colors black-border">
            Inch
          </button>
          <button className="primary-button secondary-button-colors black-border">
            Cm
          </button>
        </div>
        {measurementElements}
      </form>
    </div>
  );
}

export default Add;
