import ActiveCard from "../components/ActiveCard";

import "./Home.css";

function Home(props) {
  const activeCardElements = props.data.activeItems.map((item, index) => {
    return (
      <ActiveCard
        category={item.category}
        title={item.title}
        imageSrc={item.imageSrc}
        measurements={item.measurements}
      />
    );
  });

  return (
    <section className="home-container">
      <h1 className="tab-header">Active items</h1>
      {activeCardElements}
    </section>
  );
}
export default Home;
