import React from "react";
import { useState } from "react";
import "./Settings.css";

function Settings(props) {
  return (
    <section className="item-modal-container">
      <div className="sub-row">
        <button className="back-button secondary-link-color position-left">
          ←
        </button>
        <h3 className="bold-text header-medium">Settings</h3>
      </div>
    </section>
  );
}

export default Settings;
