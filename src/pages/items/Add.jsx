import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import SubHeader from "../../components/header/SubHeader";
import { measurementCategory } from "../../components/items/measurementInput/categoriesData";
import MeasurementInput from "../../components/items/measurementInput/MeasurementInput";
import "./Add.css";
function Add({ activeItem, addItem, settings, navigate }) {
  const [category, setCategory] = useState("Tops");
  const [imageUrl, setImageUrl] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [unit, setUnit] = useState("in");
  const [measurements, setMeasurements] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      id: uuidv4(),
      category: category,
      title: event.target.title.value,
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

    if (imageStatus === "error") {
      return;
    }
    console.log(newItem);

    addItem(newItem);
    if (event.target.active.checked) {
      activeItem(newItem, true);
    }
    navigate("/items");
  }

  useEffect(() => {
    setImageStatus("");
  }, [imageUrl]);

  return (
    <section className="main-container">
      <SubHeader
        navigate={navigate}
        title={"Add a new Item"}
        aria={"Back to items"}
      />

      <main>
        <form id="add-form" onSubmit={handleSubmit}>
          <div className="form-input">
            <label htmlFor="title" className="text-bold text-large">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`input-text`}
              required
            />
          </div>

          <div className="form-input">
            <label htmlFor="category" className="text-bold text-large">
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
            <label htmlFor="size" className="text-bold text-large">
              Size
            </label>
            <select name="size" id="size" className="input-category">
              {settings.sizes[category].map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
          </div>

          <div className="form-input">
            <label htmlFor="image" className="text-bold text-large">
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
                    alt={`thumbnail`}
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

          <div className="form-input">
            <label htmlFor="active" className="text-large">
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
