import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ItemImage from "../../components/items/itemImage/ItemImage";
import SubHeader from "../../components/header/SubHeader";
import "./ItemDetail.css";
function ItemDetail({ items, handleActive, handleDelete, navigate }) {
  const { title } = useParams();
  const item = Object.values(items).filter((item) => {
    return item.title === title;
  });
  const { active, category, size, imageSrc, measurements } = item[0];

  const measurementElements = Object.entries(measurements).map(
    ([key, values]) => (
      <div className="flex" key={key}>
        <p className="measurement-label">{key}:</p>
        <div className="measurement-value">
          <div className="measurement-value-container">
            <p>{values[0]}</p>
            <p>in</p>
          </div>
          <div className="measurement-value-container">
            <p>{values[1]}</p>
            <p>cm</p>
          </div>
        </div>
      </div>
    ),
  );
  const activeButtonElement = active ? (
    <button
      className="primary-button inactive-button-color high-z-index position-right"
      onClick={() => handleActive(title.toUpperCase(), category)}
    >
      Set as Inactive
    </button>
  ) : (
    <button
      className="primary-button high-z-index position-right"
      onClick={() => handleActive(title.toUpperCase(), category)}
    >
      Set as Active
    </button>
  );

  return (
    <main className="main-container">
      <SubHeader
        link={"/items"}
        title={"Item Details"}
        aria={"Back to Items"}
        navigate={navigate}
      />
      <section>
        <div className="text-center">
          <div className="item-detail-image-container">
            <div class="large-thumbnail">
              <ItemImage imageSrc={imageSrc} title={title} />
            </div>
          </div>
          <div className="modal-item-title-container">
            <h2 id={title} className="modal-item-title text-bold">
              {title}
            </h2>
          </div>
          <div className="grey-line"></div>
          <div className="sub-row gap-15">
            <p>{category}</p>
            <p>{size.toUpperCase()}</p>
          </div>
        </div>
        <div className="item-measurements">{measurementElements}</div>
      </section>
      <footer className="bottom-button-container">
        {activeButtonElement}
        <button
          className="primary-button high-z-index"
          // onClick={props.handleEdit}
        >
          Edit
        </button>

        <button
          className="primary-button high-z-index"
          onClick={() => handleDelete(title.toUpperCase())}
        >
          Delete
        </button>
      </footer>
    </main>
  );
}

export default ItemDetail;
