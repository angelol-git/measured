import ActiveCard from "../components/ActiveCard";

function Home(props) {
  let activeItemsLength = props.itemData.length;
  let activeCardElements;

  if (activeItemsLength) {
    activeCardElements = Object.entries(props.itemData["items"]).map(
      ([key, value]) => {
        if (value.active) {
          activeItemsLength++;
        }
        return value.active ? (
          <ActiveCard
            key={key}
            active={value.active}
            category={value.category}
            title={value.title}
            imageSrc={value.imageSrc}
            measurements={value.measurements}
          />
        ) : null;
      }
    );
  }

  return (
    <section>
      <div className="sub-row">
        <p className="item-counter text-normal">
          {activeItemsLength} Active items
        </p>
      </div>
      {activeCardElements}
    </section>
  );
}
export default Home;
