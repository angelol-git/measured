import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItemsContext } from "../../../context/ItemsContext";
import SubHeader from "../../../components/header/SubHeader";
import "./Data.css";

function Data() {
  const { items, setItems } = useItemsContext();
  const navigate = useNavigate();
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");
  const exportLength = Object.keys(items).length;

  function handleExport() {
    const itemDataString = JSON.stringify(items, null, 2);
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

  function handleImport(importedItems) {
    setItems(importedItems);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const jsonObject = JSON.parse(reader.result);
        const importLength = Object.keys(jsonObject).length;
        setImportError(``);
        setImportMessage(`Imported ${importLength} Items`);
        handleImport(jsonObject);
      } catch (error) {
        setImportMessage(`${event.target.files[0].name}`);
        if (event.target.files[0].type !== "application/JSON") {
          setImportError(
            `File format is invalid. Only .json files are allowed.`,
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
    <main className="main-container">
      <SubHeader navigate={navigate} title={"Data"} aria={"Back to Account"} />

      <div className="button-container">
        <p className="text-center text-base">Export and Import saved Items.</p>
        <div className="button-row">
          <button
            className="primary-button text-base"
            onClick={handleExport}
            aria-label="Export items"
          >
            Export
          </button>
          <p className="text-base">{exportLength} Items</p>
        </div>
        <div className="button-row">
          <button
            htmlFor="file"
            className="primary-button inactive-button-color text-base"
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
      </div>
    </main>
  );
}

export default Data;
