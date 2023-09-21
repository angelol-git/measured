import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ItemImage from "./itemImage/ItemImage";

import "./ItemCard.css";

function ItemCard({ key, items, activeItem, deleteItem }) {
  const { active, title, imageSrc } = items;
  const [hover, setHover] = useState(false);

  // function handleKeyDown(event){
  //   if(event.key === "Enter"){
  //     se
  //   }
  // }
  let titleElement = title;

  function handleHover() {
    setHover(!hover);
  }

  if (title.length > 60) {
    titleElement = title.slice(0, 57) + "...";
  }

  return (
    <Link to={`/detail/${items.title}`} className="item-card-link">
      <article key={key}>
        <div
          className="item-card black-border"
          // onKeyDown={handleKeyDown}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
          onFocus={handleHover}
          onBlur={handleHover}
          role="button"
          aria-label="Open item details"
        >
          <ItemImage imageSrc={imageSrc} title={title} hover={hover} />
          <div className={"title-hover" + (hover ? " show" : "")}>
            <h2 className="text-medium text-bold item-card-title">
              {titleElement}
            </h2>
          </div>
          <div className={"active-tag text-base" + (active ? " show" : "")}>
            <p>Active</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
export default ItemCard;
