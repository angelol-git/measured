import { useState } from "react";
import "./Data.css";

function Data(props) {
  const [importMessage, setImportMessage] = useState("");
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

  function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const jsonObject = JSON.parse(reader.result);
        const importLength = Object.keys(jsonObject).length;

        setImportMessage(`Imported ${importLength} Items`);
        console.log(importMessage);
        props.handleImport(jsonObject);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  }

  return (
    <div className="data-container">
      <div className="flex-column gap-15">
        <p>Export and Import saved Items.</p>
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
            className="display-none"
          />
          <p>{importMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default Data;
