import { useState } from "react";
import "./FilterSizes.css";

function FilterSizes(props) {
  console.log(props);
  const [allSizes, setAllSizes] = useState({
    Tops: [
      "XXS/40",
      "XS/42",
      "S/44-46",
      "M/48-50",
      "L/52-54",
      "XL/56",
      "XXL/58",
    ],
    Bottoms: [
      "26",
      "27",
      "28",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
    ],
    Outerwear: [
      "XXS/40",
      "XS/42",
      "S/44-46",
      "M/48-50",
      "L/52-54",
      "XL/56",
      "XXL/58",
    ],
  });

  const [allSizesShow, setAllSizesShow] = useState({
    Tops: false,
    Bottoms: false,
    Outerwear: false,
  });

  function handleSizeClick(event, category) {
    props.handleSizeUpdate(event.target.value, category);
  }

  function handleCategoryClick(category) {
    setAllSizesShow((prevSizes) => ({
      ...prevSizes,
      [category]: !prevSizes[category],
    }));
  }

  const categoryElement = (category) => {
    return (
      <div key={category}>
        <div
          className="category-row"
          onClick={() => {
            handleCategoryClick(category);
          }}
        >
          <div className="category-row-left">
            <h2 className="bold-text text-large">{category}</h2>
            <div className="size-item text-small">
              {!allSizesShow[category]
                ? props.settingsData.sizes[category].map((item) => {
                    return <p>{item}</p>;
                  })
                : ""}
            </div>
          </div>
          {allSizesShow[category] ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
            >
              <path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
            >
              <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
            </svg>
          )}
        </div>
        <div
          className={
            "checkbox-container" + (allSizesShow[category] ? " show" : "")
          }
        >
          {allSizes[category].map((item, index) => (
            <div className="flex align-center gap-5">
              <input
                type="checkbox"
                id={`${category}-${item}`}
                name={`${category}-${item}`}
                value={item}
                onClick={(event) => {
                  handleSizeClick(event, category);
                }}
                checked={Object.values(
                  props.settingsData.sizes[category]
                ).includes(`${item}`)}
                className="checkbox-medium"
              />

              <label for={`${category}-${item}`}>{item}</label>
            </div>
          ))}
        </div>
        <div className="category-grey-line"></div>
      </div>
    );
  };

  return (
    <div className="filterSizes-container">
      <p>Add or remove sizes to appear when adding or editing items.</p>
      <div className="allSizes-container">
        {categoryElement("Tops")}
        {categoryElement("Bottoms")}
        {categoryElement("Outerwear")}
      </div>
    </div>
  );
}

export default FilterSizes;
