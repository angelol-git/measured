import { useItemsContext } from "../context/ItemsContext";
import ActiveCard from "../components/home/ActiveCard";
import "./Home.css";

function Home() {
  const { items } = useItemsContext();

  let itemsLength = Object.keys(items).length;

  let activeCardElements;
  if (itemsLength) {
    activeCardElements = Object.entries(items)
      .filter(([, item]) => item.active)
      .sort(([, itemA], [, itemB]) => itemA.title.localeCompare(itemB.title))
      .map(([key, item]) => {
        return item.active ? <ActiveCard key={key} item={item} /> : null;
      });
  }

  return (
    <main className="main-container">
      <section className="item-counter sub-row text-small item-counter-row">
        <div className="active-items-length">
          {activeCardElements?.length || 0}
        </div>
        <div>Active Item&#40;s&#41;</div>
      </section>
      <div className="flex-column gap-15 " style={{ paddingBottom: "20px" }}>
        {activeCardElements}
      </div>
    </main>
  );
}
export default Home;
