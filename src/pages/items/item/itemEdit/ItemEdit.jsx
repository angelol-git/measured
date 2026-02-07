import { useState, useEffect, useId } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useItemsContext } from "../../../../context/ItemsContext";
import { measurementCategory } from "../../../../components/items/measurementInput/categoriesData";
import SubHeader from "../../../../components/header/SubHeader";
import MeasurementInput from "../../../../components/items/measurementInput/MeasurementInput";
import {
  TextInput,
  SelectInput,
  ImageInput,
  isValidUrl,
} from "../../../../components/items/forms/FormInputs";
import "./ItemEdit.css";

function ItemEdit({ settings }) {
  const { items, updateItem } = useItemsContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const item =
    location.state || Object.values(items).find((item) => item.id === id);
  const titleId = useId();
  const categoryId = useId();
  const sizeId = useId();

  const [unit, setUnit] = useState("in");
  const [currMeasurements, setCurrMeasurements] = useState(
    () => item?.measurements || {},
  );
  const [currCategory, setCurrCategory] = useState(() => item?.category || "");
  const [currImageSrc, setCurrImageSrc] = useState(() => item?.imageSrc || "");
  const [imageStatus, setImageStatus] = useState("");

  useEffect(() => {
    setImageStatus("");
  }, [currImageSrc]);

  if (!item) {
    return (
      <main className="main-container">
        <SubHeader navigate={navigate} title={"Item Not Found"} />
        <div style={{ padding: "20px" }}>
          <p>Item not found.</p>
          <button onClick={() => navigate("/items")} className="primary-button">
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const { active, category, size, title } = item;

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
    updateItem(newItem);
    navigate(-1);
  }

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
            const url = event.target.value;
            console.log(url);
            if (!url || isValidUrl(url)) {
              setImageStatus("loading");
              setCurrImageSrc(url);
            }
          }}
          imageStatus={imageStatus}
          setImageStatus={setImageStatus}
        />

        <TextInput
          id={titleId}
          label={"Title:"}
          name={"title"}
          type={"text"}
          value={title}
          required={true}
        />

        <div className="grey-line"></div>
        <div className="edit-category-size-row">
          <SelectInput
            id={categoryId}
            label={"Category:"}
            name={"category"}
            options={Object.keys(measurementCategory)}
            value={currCategory}
            onChange={(e) => setCurrCategory(e.target.value)}
          />

          <SelectInput
            id={sizeId}
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
