import React from "react";
import { useState } from "react";
import ItemImage from "./itemImage/ItemImage";
import SubHeader from "../header/SubHeader";
import "./ItemModal.css";
function ItemModal({ items, handleActive, handleDelete }) {
  const { active, category, title, size, imageSrc, measurements } = items;
  const [imageStatus, setImageStatus] = useState("");
  const measurementElements = Object.entries(measurements).map(
    ([key, values]) => (
      <div className="measurement-label-value-container" key={key}>
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
    <main className="modal-container" role="dialog" aria-modal="true">
      <div class="modal-inner-container">
        <SubHeader link={"/items"} title={"View"} aria={"Back to Items"} />
        <main>
          <div className="text-center">
            <div className="flex justify-center">
              <ItemImage imageSrc={imageSrc} title={title} />
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
        </main>
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
      </div>
    </main>
  );
}

export default ItemModal;
