import { useState, useEffect, useRef } from "react";
import { outerwearSizes, topsSizes, bottomsSizes } from "./sizesData";
import Category from "./Category";
import "./FilterSizes.css";

function FilterSizes(props) {
  const { sizes } = props.settingsData;
  const isInitialRender = useRef(true);
  const [outerwear, setOuterwear] = useState(
    outerwearSizes.map((size) => ({
      value: size,
      checked: sizes["Outerwear"].includes(size),
    })),
  );
  const [tops, setTops] = useState(
    topsSizes.map((size) => ({
      value: size,
      checked: sizes["Tops"].includes(size),
    })),
  );
  const [bottoms, setBottoms] = useState(
    bottomsSizes.map((size) => ({
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
            categoryType="Bottoms"
            setCategory={setBottoms}
          />
        </div>
      </main>
    </section>
  );
}

export default FilterSizes;
