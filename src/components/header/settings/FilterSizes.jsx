import { useState, useEffect, useRef } from "react";
import Category from "./filterSizes/Category";
import "./FilterSizes.css";

function FilterSizes(props) {
  const { sizes } = props.settingsData;
  const isInitialRender = useRef(true);
  const [outerwear, setOuterwear] = useState(
    ["XXS/40", "XS/42", "S/44-46", "M/48-50", "L/52-54", "XL/56", "XXL/58"].map(
      (size) => ({
        value: size,
        checked: sizes["Outerwear"].includes(size),
      }),
    ),
  );
  const [tops, setTops] = useState(
    ["XXS/40", "XS/42", "S/44-46", "M/48-50", "L/52-54", "XL/56", "XXL/58"].map(
      (size) => ({
        value: size,
        checked: sizes["Tops"].includes(size),
      }),
    ),
  );
  const [bottoms, setBottoms] = useState(
    [
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
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      const checkedData = {
        Outerwear: outerwear
          .filter((item) => item.checked)
          .map((item) => item.value),
        Tops: tops.filter((item) => item.checked).map((item) => item.value),
        Bottoms: bottoms
          .filter((item) => item.checked)
          .map((item) => item.value),
      };

      props.handleSizeUpdate(checkedData);
    }
  }, [outerwear, tops, bottoms]);

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
        <div className="categories-container">
          <Category category={tops} categoryType="Tops" setCategory={setTops} />
          <Category
            category={outerwear}
            categoryType="Outerwear"
            setCategory={setOuterwear}
          />
          <Category
            category={bottoms}
            categoryType="bottoms"
            setCategory={setBottoms}
          />
        </div>
      </main>
    </section>
  );
}

export default FilterSizes;
