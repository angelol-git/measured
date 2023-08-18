import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ItemCard from "../components/items/ItemCard";
import "./Items.css";
function Items(props) {
  const itemsLength = Object.keys(props.itemData).length;
  const [displayFilters, setDisplayFilters] = useState(false);

  let itemCardElements;

  function handleClickClose() {
    // setSlideDown(!slideDown);
    setDisplayFilters(!displayFilters);
  }
  if (itemsLength) {
    itemCardElements = Object.entries(props.itemData)
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
            values={value}
            settingsData={props.settingsData}
            handleFunctions={props.handleFunctions}
          />
        );
      });
  }
  return (
    <main className="main-container">
      <section style={{ paddingBottom: "20px" }}>
        <div className="sub-row item-counter-row">
          <button
            className="primary-button inactive-button-color position-left"
            onClick={handleClickClose}
          >
            <div className="button-with-icon">
              <img src="./data/images/filter.png" className="button-icon"></img>
              <p> Filter</p>
            </div>
          </button>
          <p className="item-counter text-small">{itemsLength} Items</p>
          <Link to="/add" className="primary-button  position-right">
            + Add
          </Link>
        </div>
        <div
          className={`filter-container text-normal  ${
            displayFilters ? "slide-down" : "slide-up"
          }`}
        >
          <div className="flex gap-5">
            <label htmlFor="category">Sort By:</label>
            <select name="sort" id="sort">
              <option value="Default">Default</option>
              {/* <option value="category">Category</option> */}
            </select>
          </div>
        </div>

        <div className="item-container">{itemCardElements}</div>
      </section>
    </main>
  );
}
export default Items;
