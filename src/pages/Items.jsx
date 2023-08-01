import React from "react";
import { Link } from "react-router-dom";
import ItemCard from "../components/items/ItemCard";
import "./Items.css";
function Items(props) {
  const itemsLength = Object.keys(props.itemData).length;
  let itemCardElements;
  if (itemsLength) {
    itemCardElements = Object.entries(props.itemData).map(([key, value]) => {
      return (
        <ItemCard
          key={key}
          values={value}
          handleFunctions={props.handleFunctions}
        />
      );
    });
  }
  return (
    <div className="main-container">
      <section style={{ paddingBottom: "20px" }}>
        <div className="sub-row item-counter-row">
          <p className="item-counter text-small">{itemsLength} Items</p>
          <Link to="/add" className="primary-button  position-right">
            + Add
          </Link>
        </div>
        <div className="item-container">{itemCardElements}</div>
      </section>
    </div>
  );
}
export default Items;
