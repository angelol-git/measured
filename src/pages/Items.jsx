import React from "react";
import ItemCard from "../components/ItemCard";
import "./Items.css";
function Items(props) {
  const itemCardElements = props.data.items.map((item, index) => {
    return (
      <ItemCard
        key={item.title}
        active={item.active}
        category={item.category}
        title={item.title}
        imageSrc={item.imageSrc}
        measurements={item.measurements}
      />
    );
  });
  return (
    <section className="page-container">
      <div className="page-title-row">
        <p className="page-header">{props.data.items.length} Items</p>
        <button className="primary-button primary-button-colors add-button">
          + Add
        </button>
      </div>
      <div className="item-container">{itemCardElements}</div>
    </section>
  );
}
export default Items;
