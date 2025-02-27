import React from "react";
import { Link } from "react-router-dom";
import ItemCard from "../../components/items/ItemCard";
import "./Items.css";
function Items({ items, activeItem, deleteItem }) {
  const itemsLength = Object.keys(items).length;
  let itemCardElements;

  if (itemsLength) {
    itemCardElements = Object.entries(items)
      //Put the active items first, and by alphabetically
      .sort(([, itemA], [, itemB]) => {
        if (itemA.active !== itemB.active) {
          return itemA.active ? -1 : 1;
        } else {
          return itemA.title.localeCompare(itemB.title);
        }
      })
      .map(([key, value]) => {
        return (
          <ItemCard
            key={key}
            items={value}
            activeItem={activeItem}
            deleteItem={deleteItem}
          />
        );
      });
  }

  return (
    <main className="main-container">
      <section
        className="sub-row item-counter-row"
        aria-label="Item Counter and Actions"
      >
        {/* <button
          className="primary-button inactive-button-color position-left"
          onClick={handleClickClose}
        >
          <div className="button-with-icon">
            <img src="./data/images/filter.png" className="button-icon"></img>
            <p> Filter</p>
          </div>
        </button> */}
        <p className="item-counter text-small">{itemsLength} Item&#40;s&#41;</p>
        <Link
          to="/items/add"
          className="primary-button position-right text-base"
          // tabIndex={fullModalOpen}
        >
          + Add
        </Link>
      </section>

      <section className="item-container">{itemCardElements}</section>
    </main>
  );
}
export default Items;
