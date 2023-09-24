import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import SubHeader from "../../../components/header/SubHeader";
import { measurementCategory } from "../../../components/items/measurementInput/categoriesData";
import MeasurementInput from "../../../components/items/measurementInput/MeasurementInput";
import ItemImage from "../../../components/items/itemImage/ItemImage";
import "./ItemEdit.css";

function ItemEdit({ items, settings, updateItem, navigate }) {
  const location = useLocation();
  const { id } = useParams();

  let item;
  //if the item was passed through item details get current parameters
  //else (not currently possible): Find the item info.
  if (location.state) {
    item = location.state;
  } else {
    item = Object.values(items).filter((item) => {
      return item.id === id;
    });
  }
  const { active, category, size, imageSrc, measurements, title } = item[0];

  const [unit, setUnit] = useState("in");
  const [currMeasurements, setCurrMeasurements] = useState(measurements);
  const [currCategory, setCurrCategory] = useState(category);
  const [currImageSrc, setCurrImageSrc] = useState(imageSrc);

  const [imageStatus, setImageStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      id: id,
      category: currCategory,
      title: event.target.title.value,
      size: event.target.size.value,
      imageSrc: currImageSrc,
      active: active,
      measurements: {},
    };

    for (let i = 0; i < measurementCategory[category].length; i++) {
      const categoryKey = measurementCategory[category][i];
      if (currMeasurements[categoryKey] === undefined) {
        continue;
      }
      if (currMeasurements[categoryKey][0].length === 0) {
        delete currMeasurements[categoryKey];
        continue;
      }
      const categoryValue = [
        currMeasurements[categoryKey][0],
        currMeasurements[categoryKey][1],
      ];

      newItem.measurements[categoryKey] = categoryValue;
    }
    updateItem(newItem);
    navigate(-1);
  }

  useEffect(() => {
    setImageStatus("");
  }, [currImageSrc]);

  return (
    <main className="main-container">
      <SubHeader
        navigate={navigate}
        title={"Edit Item"}
        aria={"Back to Item detail"}
      />
      <form id="edit-form" className="edit-container" onSubmit={handleSubmit}>
        {currImageSrc.length !== 0 ? (
          <div className="image-preview-container">
            {imageStatus !== "error" && (
              <div className="large-thumbnail skeleton">
                <img
                  id="image"
                  alt={`thumbnail`}
                  src={currImageSrc}
                  className="large-thumbnail"
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
        <div className="edit-input-row">
          <label htmlFor="image" className="text-bold text-base">
            Image:
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={currImageSrc}
            className={`input-text edit-input-text ${
              imageStatus === "error" ? "error-border" : ""
            }`}
            onChange={(event) => {
              setImageStatus("loading");
              setCurrImageSrc(event.target.value);
            }}
          />
          {imageStatus === "error" ? (
            <p className="error-text" role="alert">
              Image cannot be found
            </p>
          ) : null}
        </div>
        <div className="edit-input-row">
          <label htmlFor="title" className="text-bold text-base">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            // value={currTitle}
            defaultValue={title}
            className={"input-text edit-input-text"}
            required
          />
        </div>
        {/* {titleEmpty ? (
          <p className="error-text text-base" role="alert">
            Title cannot be empty.
          </p>
        ) : null} */}
        <div className="grey-line"></div>
        <div className="edit-category-size-row">
          <div className="edit-input-row">
            <label htmlFor="category" className="text-bold text-base">
              Category:
            </label>
            <select
              name="category"
              id="category"
              className="input-category edit-input-category"
              value={currCategory}
              onChange={(e) => setCurrCategory(e.target.value)}
            >
              {Object.keys(measurementCategory).map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="edit-input-row">
            <label htmlFor="category" className="text-bold text-base">
              Size:
            </label>
            <select
              name="size"
              id="size"
              className="input-category edit-input-category"
              defaultValue={size}
            >
              {settings.sizes[currCategory].map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <MeasurementInput
          measurementCategory={measurementCategory}
          category={currCategory}
          unit={unit}
          setUnit={setUnit}
          measurements={currMeasurements}
          setMeasurements={setCurrMeasurements}
        />

        <div>
          <input
            type="submit"
            value="Save"
            className="primary-button submit-button"
          />
        </div>
      </form>
    </main>
  );
}

export default ItemEdit;
