import ActiveCard from "../components/home/ActiveCard";

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
          values={value}
          handleActive={props.handleActive}
        />
      ) : null;
    });
  }

  return (
    <div className="main-container">
      <section style={{ paddingBottom: "20px" }}>
        <div className="item-counter sub-row text-small item-counter-row">
          <p>{activeItemsLength} Active items</p>
        </div>
        <div className="flex-column gap-15">{activeCardElements}</div>
      </section>
    </div>
  );
}
export default Home;
