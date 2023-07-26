import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Add.css";
function Add(props) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [unit, setUnit] = useState("in");
  const [category, setCategory] = useState("Tops");
  const [title, setTitle] = useState("");
  const [measurements, setMeasurements] = useState([]);
  //0 = Tops, Outerwear, 1 = Bottoms
  const measurementCategory = {
    Tops: ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
    Bottoms: ["Waist", "Inseam", "Leg Opening", "Front Rise", "Thigh", "Knee"],
    Outerwear: ["Chest", "Length", "Shoulders", "Sleeve Length", "Hem"],
  };
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
              value={measurements[item]?.[unitIndex] || ""}
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

  useEffect(() => {
    props.verifyTitle(title);
  }, [title]);

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

    setMeasurements((measurements) => ({
      ...measurements,
      [name]: [inchValue, cmValue],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      category: category,
      title: title,
      size: event.target.size.value,
      imageSrc: imageUrl,
      active: event.target.active.checked,

      measurements: {},
    };

    for (let i = 0; i < measurementCategory[category].length; i++) {
      const categoryKey = measurementCategory[category][i];
      const categoryValue = [
        measurements[categoryKey][0],
        measurements[categoryKey][1],
      ];
      newItem.measurements[categoryKey] = categoryValue;
    }

    if (props.titleError || imageError) {
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

  function handleImageError() {
    setImageError(true);
  }

  function handleImageChange(event) {
    setImageError(false);
    setImageUrl(event.target.value);
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
            onChange={(e) => setTitle(e.target.value)}
            className={`input-text ${props.titleError ? "error-border" : ""}`}
            required
          />
          {props.titleError ? (
            <p className="error-text">Error {title} already exist</p>
          ) : (
            ""
          )}
        </div>

        <div className="form-input">
          <label htmlFor="category" className="bold-text">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="input-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            className={`input-text ${imageError ? "error-border" : ""}`}
            value={imageUrl}
            onChange={handleImageChange}
          />
          {imageError ? (
            <p className="error-text">Image cannot be found </p>
          ) : (
            ""
          )}
        </div>

        {imageUrl.length !== 0 && !imageError ? (
          <div className="image-preview-container">
            <div className="image-container">
              <img
                id="image"
                src={imageUrl}
                className="medium-thumbnail"
                onError={handleImageError}
              ></img>
            </div>
          </div>
        ) : (
          ""
        )}

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
