import React from "react";
import "./ItemView.css";

function ItemView(props) {
  const measurementElements = Object.entries(props.measurements).map(
    ([key, values]) => (
      <div className="flex" key={key}>
        <p className="measurement-header">{key}:</p>
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
    )
  );
  const activeButtonElement = props.active ? (
    <button
      className="primary-button inactive-button-color high-z-index position-right"
      onClick={() => props.handleActive(props.title.toUpperCase())}
    >
      Set as Inactive
    </button>
  ) : (
    <button
      className="primary-button high-z-index position-right"
      onClick={() => props.handleActive(props.title.toUpperCase())}
    >
      Set as Active
    </button>
  );
  return (
    <section className="item-modal-container text-medium">
      <div className="sub-row">
        <button
          className="back-button position-left"
          onClick={props.handleClickModal}
        >
          ←
        </button>
      </div>
      <div className="text-center">
        <img className="large-thumbnail" src={props.imageSrc}></img>
        <h3 className="modal-title bold-text">{props.title}</h3>
        <div className="grey-line"></div>
        <div className="sub-row">
          <p>{props.category}</p>
          {activeButtonElement}
        </div>
      </div>
      <div className="item-measurements">{measurementElements}</div>
      <div className="bottom-button-container">
        <button
          className="primary-button high-z-index"
          onClick={props.handleEdit}
        >
          Edit
        </button>
        <button
          className="primary-button high-z-index"
          onClick={() => props.handleDeleteItem(props.title.toUpperCase())}
        >
          Delete
        </button>
      </div>
    </section>
  );
}

export default ItemView;
