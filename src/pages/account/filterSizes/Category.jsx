import { useState } from "react";
import "./Category.css";

function Category({ category, categoryType, setCategory }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  function handleSizeClick(value) {
    const updatedCategory = category.map((item) => {
      if (item.value === value) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    setCategory(updatedCategory);
  }

  return (
    <div key={categoryType}>
      <div
        className="category-row"
        role="button"
        aria-expanded={isCategoryOpen}
        tabIndex={0}
        onClick={() => {
          setIsCategoryOpen((prevOpen) => !prevOpen);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setIsCategoryOpen((prevOpen) => !prevOpen);
          }
        }}
      >
        <div className="category-row-left">
          <h2 className="text-bold text-large">{categoryType}</h2>
          <div className="size-item">
            {!isCategoryOpen
              ? category.map((item) => {
                  if (item.checked === true) {
                    return <p class="text-small">{item.value}</p>;
                  }
                })
              : null}
          </div>
        </div>
        {isCategoryOpen ? (
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

      <div className={"checkbox-container" + (isCategoryOpen ? " show" : "")}>
        {category.map((item) => (
          <div className="flex align-center gap-5">
            <input
              type="checkbox"
              id={`${categoryType}-${item.value}`}
              name={`${categoryType}-${item.value}`}
              value={item.value}
              onClick={(event) => {
                handleSizeClick(event.target.value);
              }}
              checked={item.checked}
              className="checkbox-medium"
            />

            <label
              htmlFor={`${categoryType}-${item.value}`}
              className="text-base"
            >
              {item.value}
            </label>
          </div>
        ))}
      </div>
      <div className="category-grey-line"></div>
    </div>
  );
}

export default Category;
