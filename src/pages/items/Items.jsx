import { Link } from "react-router-dom";
import { useItemsContext } from "../../context/ItemsContext";
import ItemCard from "../../components/items/ItemCard";
import "./Items.css";

function Items() {
  const { items } = useItemsContext();

  const itemsLength = Object.keys(items).length;

  let itemCardElements = {};
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
        return <ItemCard key={key} items={value} />;
      });
  }

  return (
    <main className="main-container">
      <section className="sub-row" aria-label="Item Counter and Actions">
        <div className="item-counter-row text-small">
          <div className="text-bold">{itemsLength}</div>
          <div> Item&#40;s&#41;</div>
        </div>
        <Link
          to="/items/add"
          className="primary-button position-right text-base"
        >
          + Add
        </Link>
      </section>

      <section className="item-container">{itemCardElements}</section>
    </main>
  );
}
export default Items;
