import ActiveCard from "../components/ActiveCard";

import "./Home.css";

function Home(props) {
  console.log("hello");
  let activeItemsLength = 0;
  const activeCardElements = props.data.items.map((item, index) => {
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
    <section className="home-container">
      <div className="page-title-row">
        <p className="page-header">{activeItemsLength} Active items</p>
      </div>
      {activeCardElements}
    </section>
  );
}
export default Home;
