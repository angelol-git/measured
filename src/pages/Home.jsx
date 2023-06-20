import React from "react";
import placeholderImg from "../assets/dracula.jpeg";
import ActiveCard from "../components/ActiveCard";
import "./Home.css";

function Home(props) {
  console.log(props);
  return (
    <section className="home-container">
      <h1 className="home-header">Active items</h1>
      <ActiveCard
        title="Tops"
        description="Undercover Oversized Dracula T Shirt"
        imageSrc={placeholderImg}
      />
      {/* <ActiveCard title="Bottoms" />
      <ActiveCard title="Outerwear" /> */}
    </section>
  );
}
export default Home;
