import { LoaderCircle } from "lucide-react";
import { useItemsContext } from "../context/ItemsContext";
import ActiveCard from "../components/home/ActiveCard";
import "./Home.css";

function Home() {
  const { items, isLoaded } = useItemsContext();

  const itemsFiltered = Object.entries(items ?? {})
    .filter(([, item]) => item.active)
    .sort(([, a], [, b]) => a.title.localeCompare(b.title));

  if (!isLoaded)
    return (
      <main className="main-container">
        <LoaderCircle size={20} className="loading-spinner" />
      </main>
    );
  else
    return (
      <main className="main-container">
        <section className="item-counter sub-row text-small item-counter-row">
          <div className="active-items-length">{itemsFiltered.length || 0}</div>
          <div>Active Item&#40;s&#41;</div>
        </section>
        <div className="flex-column gap-15 " style={{ paddingBottom: "20px" }}>
          {itemsFiltered.map(([key, item]) => {
            return item.active ? <ActiveCard key={key} item={item} /> : null;
          })}
        </div>
      </main>
    );
}
export default Home;
