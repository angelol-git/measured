import { useState, useEffect, useId } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SubHeader from "../../../components/header/SubHeader";
import { measurementCategory } from "../../../components/items/measurementInput/categoriesData";
import MeasurementInput from "../../../components/items/measurementInput/MeasurementInput";
import {
  TextInput,
  SelectInput,
  ImageInput,
} from "../../../components/forms/FormInputs";
import "./ItemEdit.css";

function ItemEdit({ items, settings, updateItem }) {
  const location = useLocation();
  const navigate = useNavigate();
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

    for (let i = 0; i < measurementCategory[currCategory].length; i++) {
      const categoryKey = measurementCategory[currCategory][i];
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
    console.log(newItem);
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
              <div className="large-thumbnail  skeleton">
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

        <ImageInput
          label={"Image:"}
          value={currImageSrc}
          onChange={(event) => {
            setImageStatus("loading");
            setCurrImageSrc(event.target.value);
          }}
          imageStatus={imageStatus}
          setImageStatus={setImageStatus}
        />

        <TextInput
          id={useId}
          label={"Title:"}
          name={"title"}
          type={"text"}
          value={title}
          required={true}
        />

        <div className="grey-line"></div>
        <div className="edit-category-size-row">
          <SelectInput
            id={useId}
            label={"Category:"}
            name={"category"}
            options={Object.keys(measurementCategory)}
            value={currCategory}
            onChange={(e) => setCurrCategory(e.target.value)}
          />

          <SelectInput
            id={useId}
            label={"Size:"}
            name={"size"}
            value={size}
            options={settings.sizes[category]}
          />
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
