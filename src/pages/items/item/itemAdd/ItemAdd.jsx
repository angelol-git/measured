import { useState, useEffect, useId } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useItemsContext } from "../../../../context/ItemsContext";
import { useSettingsContext } from "../../../../context/SettingsContext";
import SubHeader from "../../../../components/header/SubHeader";
import { measurementCategory } from "../../../../components/items/measurementInput/categoriesData";
import MeasurementInput from "../../../../components/items/measurementInput/MeasurementInput";
import {
  TextInput,
  SelectInput,
  ImageInput,
  CheckboxInput,
  isValidUrl,
} from "../../../../components/items/forms/FormInputs";
import "./ItemAdd.css";

function Add() {
  const { activeItem, addItem } = useItemsContext();
  const { settings } = useSettingsContext();
  const [measurements, setMeasurements] = useState([]);
  const [category, setCategory] = useState("Tops");
  const [imageUrl, setImageUrl] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [unit, setUnit] = useState("in");
  const navigate = useNavigate();

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
          <TextInput
            id={useId()}
            label={"Title"}
            name={"title"}
            type={"text"}
            value={""}
            required={true}
          />

          <SelectInput
            id={useId()}
            label={"Category"}
            name={"category"}
            options={Object.keys(measurementCategory)}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <SelectInput
            id={useId}
            label={"Size"}
            name={"size"}
            options={settings.sizes[category]}
          />

          <ImageInput
            label={"Image"}
            value={imageUrl}
            onChange={(event) => {
              const url = event.target.value;
              setImageUrl(url);
              if (!url || isValidUrl(url)) {
                setImageStatus("loading");
              } else {
                setImageStatus("error");
              }
            }}
            imageStatus={imageStatus}
          />

          {imageUrl.length !== 0 ? (
            <div className="image-preview-container">
              {imageStatus !== "error" && (
                <div className="image-container skeleton">
                  <img
                    id={useId}
                    alt="preview thumbnail"
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

          <CheckboxInput
            label={"Set as active"}
            id={useId}
            name={"active"}
            checked={false}
          />

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
