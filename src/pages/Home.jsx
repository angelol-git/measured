import ActiveCard from "../components/ActiveCard";

function Home(props) {
  let itemsLength = Object.keys(props.itemData).length;
  let activeItemsLength = 0;
  let activeCardElements;
  if (itemsLength) {
    activeCardElements = Object.entries(props.itemData).map(([key, value]) => {
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
          handleActive={props.handleActive}
        />
      ) : null;
    });
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
