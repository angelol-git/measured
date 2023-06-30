import React from "react";
import "./ItemModal.css";
function ItemModal(props) {
  const activeButtonElement = props.active ? (
    <button className="main-button deactivate high-z-index position-right">
      Set as not Active
    </button>
  ) : (
    <button className="main-button black-button high-z-index position-right">
      Set as Active
    </button>
  );

  const measurementElements = Object.entries(props.measurements).map(
    ([key, values]) => (
      <div className="flex text-medium" key={key}>
        <p className="measurement-header bold-text">{key}:</p>
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

  if (props.clickDetail) {
    return (
      <section className="item-detail-container">
        <div className="item-info text-normal">
          <button className="back-button" onClick={props.handleClickDetail}>
            ←
          </button>
          <div className="text-center">
            <img className="large-thumbnail" src={props.imageSrc}></img>
            <h3 className="modal-title bold-text text-medium">{props.title}</h3>
            <div className="grey-line"></div>
            <div className="sub-row">
              <p className="text-medium">{props.category}</p>
              {activeButtonElement}
            </div>
          </div>
          <div className="item-measurements">{measurementElements}</div>
          <div className="button-container">
            <button className="main-button black-button high-z-index">
              Edit
            </button>
            <button className="main-button black-button high-z-index">
              Delete
            </button>
          </div>
        </div>
      </section>
    );
  } else {
    return null;
  }
}

export default ItemModal;
