import { useState } from "react";
import { Link } from "react-router-dom";
import { useItemsContext } from "../../context/ItemsContext";
import MeasurementValues from "../items/measurementValues/MeasurementValues";
import ItemImage from "../items/itemImage/ItemImage";
import "./ActiveCard.css";

function ActiveCard({ key, item }) {
  const { activeItem } = useItemsContext();
  const { category, title, imageSrc, measurements } = item;
  const [detailView, setDetailView] = useState(false);

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
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      aria-expanded={detailView}
    >
      <header className="active-header">
        <div className="active-title-container">
          <h2 className="active-title text-bold text-base">{title}</h2>
          <p>{category}</p>
        </div>
        <div className="active-image-container">
          <ItemImage imageSrc={imageSrc} title={title} />
        </div>
      </header>
      <section className={"active-details" + (detailView ? " show" : "")}>
        <div className="active-measurement-container">
          <MeasurementValues
            measurements={measurements}
            textSize={"text-base"}
          />
        </div>
        <footer className="active-button-row">
          <button
            className="primary-button inactive-button-color"
            onClick={() => activeItem(item.id, false)}
          >
            Set as Inactive
          </button>
          <Link to={`/items/${item.id}`}>
            <button className="primary-button">View Details</button>
          </Link>
        </footer>
      </section>
    </article>
  );
}
export default ActiveCard;
