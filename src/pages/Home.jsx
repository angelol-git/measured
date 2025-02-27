import ActiveCard from "../components/home/ActiveCard";

function Home({ items, activeItem }) {
  let itemsLength = Object.keys(items).length;
  let activeItemsLength = 0;
  let activeCardElements;
  if (itemsLength) {
    activeCardElements = Object.entries(items).map(([key, value]) => {
      if (value.active) {
        activeItemsLength++;
      }
      return value.active ? (
        <ActiveCard key={key} id={key} values={value} activeItem={activeItem} />
      ) : null;
    });
  }

  return (
    <main className="main-container">
      <section className="item-counter sub-row text-small item-counter-row">
        <p>
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {" "}
            {activeItemsLength}{" "}
          </span>
          Active Item&#40;s&#41;
        </p>
      </section>
      <div className="flex-column gap-15 " style={{ paddingBottom: "20px" }}>
        {activeCardElements}
      </div>
    </main>
  );
}
export default Home;
