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
          customTabIndex={activeItemsLength}
          handleActive={props.handleActive}
        />
      ) : null;
    });
  }

  return (
    <main className="main-container">
      <div className="item-counter sub-row text-small item-counter-row">
        <p>{activeItemsLength} Active items</p>
      </div>
      <div className="flex-column gap-15 " style={{ paddingBottom: "20px" }}>
        {activeCardElements}
      </div>
    </main>
  );
}
export default Home;
