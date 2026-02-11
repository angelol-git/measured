import "./MeasurementInput.css";

function MeasurementInput({
  measurementCategory,
  category,
  unit,
  setUnit,
  measurements,
  setMeasurements,
}) {
  const unitIndex = unit === "in" ? 0 : 1;
  const maxUnit = unit === "in" ? 99 : 999;
  const inchButtonClass =
    unit === "in" ? " primary-button" : " secondary-button-color";
  const cmButtonClass =
    unit === "in" ? " secondary-button-color" : " primary-button";

  function handleUnitClick() {
    const newUnit = unit === "in" ? "cm" : "in";
    setUnit(newUnit);
  }

  function handleUnitInput(event) {
    const { name, value } = event.target;
    let inchValue = 0;
    let cmValue = 0;

    if (value.includes(".")) {
      if (value.split(".")[1].length > 2) {
        return;
      }
    }

    if (unit === "in") {
      inchValue = value;
      cmValue = (inchValue * 2.54).toFixed(2);
    } else {
      cmValue = value;
      inchValue = (cmValue / 2.54).toFixed(2);
    }

    setMeasurements((measurements) => ({
      ...measurements,
      [name]: [inchValue, cmValue],
    }));
  }
  return (
    <div>
      <div className="measurement-header-row">
        <p className="text-bold text-large">Measurements</p>
        <div>
          <button
            type="button"
            className={
              "primary-button text-base black-border" + inchButtonClass
            }
            onClick={handleUnitClick}
          >
            Inch
          </button>
          <button
            type="button"
            className={"primary-button text-base black-border" + cmButtonClass}
            onClick={handleUnitClick}
          >
            Cm
          </button>
        </div>
      </div>
      <div className="measurement-container">
        {measurementCategory[category].map((item, index) => (
          <div className="unit-input-row" key={index}>
            <label htmlFor={`${item}`} className="text-base">
              {item}
            </label>
            <div>
              <input
                type="number"
                id={`${item}`}
                name={`${item}`}
                className="unit-input text-base"
                value={measurements[item]?.[unitIndex] || ""}
                max={maxUnit}
                step=".1"
                placeholder="0.00"
                autoComplete="off"
                onChange={handleUnitInput}
              />
              {unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeasurementInput;
