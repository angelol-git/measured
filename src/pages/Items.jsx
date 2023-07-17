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
          active={value.active}
          category={value.category}
          title={value.title}
          size={value.size}
          imageSrc={value.imageSrc}
          measurements={value.measurements}
          handleActive={props.handleActive}
          handleUpdate={props.handleUpdate}
          handleDeleteItem={props.handleDeleteItem}
          verifyTitle={props.verifyTitle}
          titleError={props.titleError}
        />
      );
    });
  }
  return (
    <section>
      <div className="sub-row item-counter-row">
        <p className="item-counter text-small">{itemsLength} Items</p>
        <Link to="/add" className="primary-button  position-right">
          + Add
        </Link>
      </div>
      <div className="item-container">{itemCardElements}</div>
    </section>
  );
}
export default Items;
