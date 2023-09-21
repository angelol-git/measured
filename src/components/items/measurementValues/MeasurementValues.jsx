import "./MeasurementValues.css";
function MeasurementValues({ measurements }) {
  return (
    <div className="measurement-values-container">
      {Object.entries(measurements).map(([key, values]) => (
        <div className="measurement-values-row" key={key}>
          <p className="measurement-values-label text-base">{key}:</p>
          <div className="measurement-values-value">
            <div className="measurement-values-value-container text-base">
              <p>{values[0]}</p>
              <p>in</p>
            </div>
            <div className="measurement-values-value-container text-base">
              <p>{values[1]}</p>
              <p>cm</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default MeasurementValues;
