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
      <p className="page-header">
        {props.data.activeItems.length} Active items
      </p>
      {activeCardElements}
    </section>
  );
}
export default Home;
