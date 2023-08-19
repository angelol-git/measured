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
            `File format is invalid. Only .json files are allowed.`
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

  function handleImportButton(event) {
    if (event.key === "Enter" || event.type === "click") {
      document.getElementById("file").click();
    }
  }
  return (
    <section className="inner-container">
      <header className="sub-row">
        <button
          className="back-button secondary-link-color position-left"
          onClick={() => props.setSettingsMode("menu")}
          aria-label="Back to settings"
        >
          ←
        </button>
        <h2 className="bold-text header-medium">Data</h2>
      </header>
      <main className="button-container">
        <p className="text-center">Export and Import saved Items.</p>
        <div className="button-row">
          <button
            className="primary-button"
            onClick={handleExportClick}
            aria-label="Export items"
          >
            Export
          </button>
          <p>{exportLength} Items</p>
        </div>
        <div className="button-row">
          <button
            htmlFor="file"
            className="primary-button inactive-button-color"
            tabIndex={0}
            onClick={handleImportButton}
            onKeyDown={handleImportButton}
            aria-label="Import items"
          >
            Import
          </button>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="display-none"
          />
          <p>{importMessage}</p>
        </div>
        <p className="import-error error-text" role="alert">
          {importError}
        </p>
      </main>
    </section>
  );
}

export default Data;
