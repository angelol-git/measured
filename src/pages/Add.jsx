import React from "react";
import "./Add.css";
function Add() {
  return (
    <div>
      <button className="back-button" onClick={props.handleClickDetail}>
        ←
      </button>
      <h1>Add</h1>
    </div>
  );
}

export default Add;
