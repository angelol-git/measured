import { useState } from "react";
import "./Data.css";

function Data(props) {
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");
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
      console.log(event.target.files[0].type);

      try {
        const jsonObject = JSON.parse(reader.result);
        const importLength = Object.keys(jsonObject).length;
        setImportError(``);
        setImportMessage(`Imported ${importLength} Items`);
        console.log(importMessage);
        props.handleImport(jsonObject);
      } catch (error) {
        setImportMessage(`${event.target.files[0].name}`);
        if (event.target.files[0].type !== "application/JSON") {
          setImportError(
            <p className="import-error error-text">
              File format is invalid. <br />
              Only .json files are allowed.
            </p>
          );
          return;
        }
        setImportError(`Error reading JSON`);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  }

  return (
    <div className="data-container">
      <div className="flex-column gap-15">
        <p className="text-center">Export and Import saved Items.</p>
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
        {importError}
      </div>
    </div>
  );
}

export default Data;
