import { useState } from "react";
import MeasurementValues from "../items/measurementValues/MeasurementValues";
import ItemImage from "../items/itemImage/ItemImage";
import "./ActiveCard.css";

function ActiveCard({ key, values, activeItem }) {
  const { active, category, title, imageSrc, measurements } = values;
  const [detailView, setDetailView] = useState(false);
  const activeButtonElement = active ? (
    <button
      className="primary-button inactive-button-color"
      onClick={() => activeItem(title.toUpperCase(), category)}
    >
      Set as Inactive
    </button>
  ) : null;
  function handleClick() {
    setDetailView((detailView) => !detailView);
  }
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      setDetailView((detailView) => !detailView);
    }
  }

  return (
    <article
      key={key}
      className="active-card text-base"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-expanded={detailView}
    >
      <header className="active-header">
        <div className="active-title-container">
          <h2 className="active-title text-bold text-base">{title}</h2>
          <p>{category}</p>
        </div>
        <div class="active-image-container">
          <ItemImage imageSrc={imageSrc} title={title} />
        </div>
      </header>
      <section className={"active-details" + (detailView ? " show" : "")}>
        <div className="active-measurement-container">
          <MeasurementValues measurements={measurements} />
        </div>
        <footer className="active-button-row">{activeButtonElement}</footer>
      </section>
    </article>
  );
}
export default ActiveCard;
