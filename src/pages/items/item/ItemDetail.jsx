import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SubHeader from "../../../components/header/SubHeader";
import MeasurementValues from "../../../components/items/measurementValues/MeasurementValues";
import ItemImage from "../../../components/items/itemImage/ItemImage";
import "./ItemDetail.css";

function ItemDetail({ items, activeItem, deleteItem }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const item = Object.values(items).filter((item) => {
    return item.id === id;
  });
  const { active, category, size, imageSrc, measurements, title } = item[0];

  return (
    <main className="main-container">
      <SubHeader
        navigate={navigate}
        title={"Item Details"}
        aria={"Back to Items"}
      />
      <section className="item-detail-container">
        <div className="item-detail-image-container">
          <div className="large-thumbnail">
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
          onClick={() => activeItem(id, false)}
        >
          {active ? "Set as Inactive" : "Set as Active"}
        </button>
        <Link to={`/items/${id}/edit`} state={item}>
          <button className="primary-button">Edit</button>
        </Link>

        <button
          className="primary-button"
          onClick={() => {
            deleteItem(id);
            navigate("/items");
          }}
        >
          Delete
        </button>
      </footer>
    </main>
  );
}

export default ItemDetail;
