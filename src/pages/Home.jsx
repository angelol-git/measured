import ActiveCard from "../components/ActiveCard";

function Home(props) {
  let activeItemsLength = 0;
  const activeCardElements = props.itemData.items.map((item, index) => {
    if (item.active) {
      activeItemsLength++;
    }
    return item.active ? (
      <ActiveCard
        key={item.title}
        active={item.active}
        category={item.category}
        title={item.title}
        imageSrc={item.imageSrc}
        measurements={item.measurements}
      />
    ) : (
      ""
    );
  });

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
