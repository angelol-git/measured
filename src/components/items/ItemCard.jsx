import { Link } from "react-router-dom";
import ItemImage from "./itemImage/ItemImage";

import "./ItemCard.css";

function ItemCard({ key, items }) {
  const { active, title, imageSrc } = items;


  return (
    <article key={key} className="item-card black-border">
      <Link
        to={`/items/${items.id}`}
        className="item-card-link"
        aria-label={`View details for ${title}`}
      >
        <ItemImage imageSrc={imageSrc} title={title} />
        <div className="title-hover">
          <h2 className="text-medium text-bold item-card-title">
            {title}
          </h2>
        </div>
        <div className={"active-tag text-base" + (active ? " show" : "")}>
          <p>Active</p>
        </div>
      </Link>
    </article>
  );
}
export default ItemCard;
