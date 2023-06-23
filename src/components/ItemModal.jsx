import React from "react";
import "./ItemModal.css";
function ItemModal(props) {
  const activeButtonElement = props.active ? (
    <button className="primary-button  deactivate">Set as not Active</button>
  ) : (
    <button className="primary-button primary-button-colors">
      Set as Active
    </button>
  );

  const measurementElements = Object.entries(props.measurements).map(
    ([key, values]) => (
      <div className="detail-row" key={key}>
        <p className="detail-header bold-text">{key}:</p>
        <div className="detail-measurements">
          <div className="detail-container">
            <p className="detail-value">{values[0]}</p>
            <p>in</p>
          </div>
          <div className="detail-container">
            <p className="detail-value">{values[1]}</p>
            <p>cm</p>
          </div>
        </div>
      </div>
    )
  );

  if (props.clickDetail) {
    return (
      <section
        className="item-detail-container"
        onClick={props.handleClickDetail}
      >
        <div className="item-info">
          <div className="text-center">
            <img className="large-thumbnail" src={props.imageSrc}></img>
            <h3 className="modal-title">{props.title}</h3>
            <div className="grey-line"></div>
            <div className="title-row">
              <p className="item-category">{props.category}</p>
              {activeButtonElement}
            </div>
          </div>
          <div className="item-measurements">{measurementElements}</div>
          <div className="button-container">
            <button className="primary-button primary-button-colors">
              Edit
            </button>
            <button className="primary-button primary-button-colors">
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
