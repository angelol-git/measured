import { useState, useEffect, useRef } from "react";
import { outerwearSizes, topsSizes, bottomsSizes } from "./sizesData";
import Category from "./Category";
import SubHeader from "../../../components/header/SubHeader";

import "./FilterSizes.css";

function FilterSizes({ settings, handleSizeUpdate }) {
  const { sizes } = settings;
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

      handleSizeUpdate(checkedData);
    }
  }, [outerwear, tops, bottoms]);

  return (
    <main className="main-container">
      <SubHeader
        link={"/account"}
        title={"Filter Sizes"}
        aria={"Back to Home"}
      />
      <div>
        <p className="text-base text-center">
          Add or remove sizes to appear when adding or editing items.
        </p>
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
      </div>
    </main>
  );
}

export default FilterSizes;
