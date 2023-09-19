import { useState } from "react";
import "./MeasurementInput.css";

function MeasurementInput({}) {
  return (
    <div className="measurement-container">
      {measurementCategory[category].map((item, index) => (
        <div className="unit-input-row" key={index}>
          <label htmlFor={`${item}`} className="text-normal">
            {item}
          </label>
          <div>
            <input
              type="number"
              id={`${item}`}
              name={`${item}`}
              className="unit-input text-normal"
              value={measurements[item]?.[unitIndex] || ""}
              max={maxUnit}
              step=".1"
              placeholder="0.00"
              onChange={handleUnitInput}
            />
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeasurementInput;
