import { useState } from "react";
import "./FilterSizes.css";

function FilterSizes(props) {
  const [allSizes, setAllSizes] = useState({
    Tops: ["XXS", "S", "M", "L", "XL", "XXL"],
    Bottoms: ["28", "30", "32", "34", "36"],
    Outerwear: ["XXS", "S", "M", "L", "XL", "XXL"],
  });

  const [allSizesShow, setAllSizesShow] = useState({
    Tops: false,
    Bottoms: false,
    Outerwear: false,
  });

  function handleSizeClick(event, category) {
    console.log(event.target.value);
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
          <h2 className="bold-text text-large">{category}</h2>
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
            <div>
              <input
                type="checkbox"
                id={`${category}-${item}`}
                name={`${category}-${item}`}
                value={item}
                onClick={handleSizeClick}
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
