import React from "react";
import { useState } from "react";
import "./EditView.css";

function EditView(props) {
  const [currentUnit, setCurrentUnit] = useState("in");
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(props.title);
  const [currentImage, setCurrentImage] = useState(props.imageSrc);
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

  const measurementElements = (
    <div className="measurement-container">
      {measurementCategory[currentCategory].map((item, index) => (
        <div className="edit-input-row" key={index}>
          <label htmlFor={`${item}`} className="text-normal">
            {item}
          </label>
          <div>
            <input
              type="number"
              id={`${item}`}
              name={`${item}`}
              className="form-input text-normal"
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

  function handleSave(event) {
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
    setEditMode(false);
  }
  function handleTitle(event) {
    setCurrentTitle(event.target.value);
  }

  function handleImage(event) {
    setCurrentTitle(event.target.value);
  }
  function handleImagePreview(event) {
    setCurrentImage(event.target.value);
    let previewElement = document.getElementById("image-preview");
    if (event.target.value.length > 0) {
      previewElement.src = event.target.value;
      previewElement.classList.add("display-block");
    } else {
      previewElement.classList.remove("display-block");
    }
  }

  return (
    <section className="item-modal-container">
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
      <form id="edit-form" className="flex-column gap-5 text-normal">
        <div className="image-preview-container">
          <img
            id="image-preview"
            className="medium-thumbnail"
            src={currentImage}
          ></img>
        </div>
        <div className="form-row">
          <label htmlFor="image">Image: </label>
          <input
            type="text"
            id="image"
            name="image"
            placeholder="Image URL"
            value={currentImage}
            className="text-normal form-input"
            onChange={handleImagePreview}
          />
        </div>
        <div className="form-row">
          <label htmlFor="html">Title: </label>
          <input
            type="text"
            id="title"
            name="title"
            value={currentTitle}
            className="text-normal form-input"
            onChange={handleTitle}
          ></input>
        </div>

        <div className="grey-line"></div>
        <div className="form-row justify-center">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            id="category"
            className="category text-normal"
          >
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Outerwear">Outerwear</option>
          </select>
        </div>
        {measurementElements}
        <div className="edit-button-container">
          <input
            type="submit"
            value="Save"
            className="primary-button submit-button"
          />
        </div>
      </form>
    </section>
  );
}

export default EditView;
