import React from "react";
import { useParams } from "react-router-dom";
import SubHeader from "../../components/header/SubHeader";
import MeasurementValues from "../../components/items/measurementValues/MeasurementValues";
import ItemImage from "../../components/items/itemImage/ItemImage";
import "./ItemDetail.css";

function ItemDetail({ items, activeItem, deleteItem, navigate }) {
  const { title } = useParams();
  const item = Object.values(items).filter((item) => {
    return item.title === title;
  });
  const { active, category, size, imageSrc, measurements } = item[0];

  return (
    <main className="main-container">
      <SubHeader
        navigate={navigate}
        title={"Item Details"}
        aria={"Back to Items"}
      />
      <section className="item-detail-container">
        <div className="item-detail-image-container">
          <div class="large-thumbnail">
            <ItemImage imageSrc={imageSrc} title={title} />
          </div>
        </div>
        <div className="item-detail-title-container">
          <h2 id={title} className="item-detail-title text-bold">
            {title}
          </h2>
        </div>
        <div className="grey-line"></div>
        <div className="item-detail-category-size-row text-large">
          <p>{category}</p>
          <p>{size.toUpperCase()}</p>
        </div>

        <div className="item-measurements">
          <MeasurementValues
            measurements={measurements}
            textSize={"text-large"}
          />
        </div>
      </section>

      <footer className="bottom-button-container">
        <button
          className={`primary-button position-right ${
            active ? "inactive-button-color" : ""
          }`}
          onClick={() => activeItem(title.toUpperCase(), category)}
        >
          {active ? "Set as Inactive" : "Set as Active"}
        </button>
        <button
          className="primary-button"
          // onClick={props.handleEdit}
        >
          Edit
        </button>

        <button
          className="primary-button"
          onClick={() => deleteItem(title.toUpperCase())}
        >
          Delete
        </button>
      </footer>
    </main>
  );
}

export default ItemDetail;
