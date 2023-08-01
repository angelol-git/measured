import "./Data.css";

function Data(props) {
  const exportLength = Object.keys(props.itemData).length;

  function handleExportClick() {
    const itemDataString = JSON.stringify(props.itemData, null, 2);
    const blob = new Blob([itemDataString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "items.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    const itemDataString = JSON.stringify(props.itemData, null, 2);
    const blob = new Blob([itemDataString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "items.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="data-container text-center">
      <p>Export and Import saved Items.</p>
      <div className="button-container">
        <div className="button-row">
          <button className="primary-button" onClick={handleExportClick}>
            Export
          </button>
          <p>{exportLength} Items</p>
        </div>
        <div className="button-row">
          <label for="file" className="primary-button inactive-button-color">
            Import
          </label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

export default Data;
