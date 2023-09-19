import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { measurementCategory } from "../components/items/measurementInput/categoriesData";
import MeasurementInput from "../components/items/measurementInput/MeasurementInput";
import "./Add.css";
function Add(props) {
  const navigate = useNavigate();
  const [imageStatus, setImageStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [unit, setUnit] = useState("in");
  const [category, setCategory] = useState("Tops");
  const [title, setTitle] = useState("");
  const [measurements, setMeasurements] = useState([]);

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
      if (measurements[categoryKey] === undefined) {
        continue;
      }
      const categoryValue = [
        measurements[categoryKey][0],
        measurements[categoryKey][1],
      ];

      newItem.measurements[categoryKey] = categoryValue;
    }

    if (props.titleError || imageStatus === "error") {
      return;
    }

    props.addItem(newItem);
    props.activeItem(
      event.target.title.value.toUpperCase(),
      event.target.category.value,
      true,
    );
    navigate("/items");
  }

  useEffect(() => {
    props.handleTitle(title);
  }, [title]);

  useEffect(() => {
    setImageStatus("");
  }, [imageUrl]);

  return (
    <section className="add-container">
      <header className="sub-row">
        <Link to="/items" className="position-left">
          <button className="back-button" aria-label="Back to items page">
            ←
          </button>
        </Link>
        <h3 className="bold-text header-medium">Add a new item</h3>
      </header>
      <main>
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
              <p className="error-text" role="alert">
                Error {title} already exist
              </p>
            ) : null}
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
              {Object.keys(measurementCategory).map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input">
            <label htmlFor="size" className="bold-text">
              Size
            </label>
            <select name="size" id="size" className="input-category">
              {props.settingsData.sizes[category].map((item) => {
                return <option value={item}>{item}</option>;
              })}
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
              className={`input-text ${
                imageStatus === "error" ? "error-border" : ""
              }`}
              value={imageUrl}
              onChange={(event) => {
                setImageStatus("loading");
                setImageUrl(event.target.value);
              }}
            />
            {imageStatus === "error" ? (
              <p className="error-text" role="alert">
                Image cannot be found
              </p>
            ) : null}
          </div>

          {imageUrl.length !== 0 ? (
            <div className="image-preview-container">
              {imageStatus !== "error" && (
                <div className="image-container skeleton">
                  <img
                    id="image"
                    src={imageUrl}
                    className="medium-thumbnail"
                    onLoad={() => {
                      setImageStatus("success");
                    }}
                    onError={() => {
                      setImageStatus("error");
                    }}
                  />
                </div>
              )}
            </div>
          ) : null}

          <div className="active-input">
            <label htmlFor="active">
              Set as active:
              <input type="checkbox" id="active" name="active" value="active" />
            </label>
          </div>

          <div>
            <MeasurementInput
              measurementCategory={measurementCategory}
              category={category}
              unit={unit}
              setUnit={setUnit}
              measurements={measurements}
              setMeasurements={setMeasurements}
            />
          </div>

          <input
            type="submit"
            value="Save"
            className="primary-button submit-button"
          />
        </form>
      </main>
    </section>
  );
}

export default Add;
