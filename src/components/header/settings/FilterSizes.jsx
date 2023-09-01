import { useState, useEffect, useRef } from "react";
import "./FilterSizes.css";

function FilterSizes(props) {
  const { sizes } = props.settingsData;
  const isInitialRender = useRef(true);
  const [allSizes, setAllSizes] = useState({
    Outerwear: [
      "XXS/40",
      "XS/42",
      "S/44-46",
      "M/48-50",
      "L/52-54",
      "XL/56",
      "XXL/58",
    ].map((size) => ({
      value: size,
      checked: sizes["Outerwear"].includes(size),
    })),
    Tops: [
      "XXS/40",
      "XS/42",
      "S/44-46",
      "M/48-50",
      "L/52-54",
      "XL/56",
      "XXL/58",
    ].map((size) => ({
      value: size,
      checked: sizes["Tops"].includes(size),
    })),
    Bottoms: [
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
    ].map((size) => ({
      value: size,
      checked: sizes["Bottoms"].includes(size),
    })),
  });

  const [allSizesShow, setAllSizesShow] = useState({
    Tops: false,
    Bottoms: false,
    Outerwear: false,
  });

  function handleSizeClick(value, category) {
    setAllSizes((prevSizes) => ({
      ...prevSizes,
      [category]: prevSizes[category].map((item) => {
        return item.value === value
          ? { ...item, checked: !item.checked }
          : item;
      }),
    }));
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      const checkedData = {};
      Object.keys(allSizes).forEach((category) => {
        checkedData[category] = allSizes[category]
          .filter((item) => item.checked)
          .map((item) => item.value);
      });

      props.handleSizeUpdate(checkedData);
    }
  }, [allSizes]);

  function handleCategoryClick(category) {
    setAllSizesShow((prevSizes) => ({
      ...prevSizes,
      [category]: !prevSizes[category],
    }));
  }
  function handleKeyDown(event, category) {
    if (event.key === "Enter") {
      setAllSizesShow((prevSizes) => ({
        ...prevSizes,
        [category]: !prevSizes[category],
      }));
    }
  }

  const categoryElement = (category) => {
    return (
      <div key={category}>
        <div
          className="category-row"
          role="button"
          aria-expanded={allSizesShow[category]}
          tabIndex={0}
          onClick={() => {
            handleCategoryClick(category);
          }}
          onKeyDown={(event) => {
            handleKeyDown(event, category);
          }}
        >
          <div className="category-row-left">
            <h2 className="bold-text text-large">{category}</h2>
            <div className="size-item text-small">
              {!allSizesShow[category]
                ? sizes[category].map((item) => {
                    return <p>{item}</p>;
                  })
                : ""}
            </div>
          </div>
          {/* Drop down Arrows*/}
          {allSizesShow[category] ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              title="Shrink arrow"
            >
              <path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              title="Expand arrow"
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
                id={`${category}-${item.value}`}
                name={`${category}-${item.value}`}
                value={item.value}
                onClick={(event) => {
                  handleSizeClick(event.target.value, category);
                }}
                checked={item.checked}
                className="checkbox-medium"
              />

              <label htmlFor={`${category}-${item.value}`}>{item.value}</label>
            </div>
          ))}
        </div>
        <div className="category-grey-line"></div>
      </div>
    );
  };

  return (
    <section className="inner-container">
      <header className="sub-row">
        <button
          className="back-button secondary-link-color position-left"
          onClick={() => props.setSettingsMode("menu")}
          aria-label="Back to settings"
        >
          ←
        </button>
        <h2 className="bold-text header-medium">Filter Sizes</h2>
      </header>
      <main>
        <p>Add or remove sizes to appear when adding or editing items.</p>
        <div className="allSizes-container">
          {categoryElement("Tops")}
          {categoryElement("Bottoms")}
          {categoryElement("Outerwear")}
        </div>
      </main>
    </section>
  );
}

export default FilterSizes;
