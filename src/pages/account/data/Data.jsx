import { useNavigate } from "react-router-dom";
import { useItemsContext } from "../../../context/ItemsContext";
import useImportedData from "../../../hooks/useImportedData";
import SubHeader from "../../../components/header/SubHeader";
import "./Data.css";

function Data() {
  const { items, setItems } = useItemsContext();
  const {
    handleImportClick,
    handleExportClick,
    handleFileChange,
    importMessage,
    importError,
  } = useImportedData({ items, setItems });
  const navigate = useNavigate();

  return (
    <main className="main-container">
      <SubHeader navigate={navigate} title={"Data"} aria={"Back to Account"} />

      <div className="button-container">
        <p className="text-center text-base">Export and Import saved Items.</p>
        <div className="button-row">
          <button
            className="primary-button text-base"
            onClick={handleExportClick}
            aria-label="Export items"
          >
            Export
          </button>
          <p className="text-base file-name">
            {Object.keys(items).length} Items
          </p>
        </div>
        <div className="button-row">
          <button
            htmlFor="file"
            className="primary-button inactive-button-color text-base"
            tabIndex={0}
            onClick={handleImportClick}
            onKeyDown={handleImportClick}
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
          <p className="text-base file-name">{importMessage}</p>
        </div>
        <p className="import-error error-text" role="alert">
          {importError}
        </p>
      </div>
    </main>
  );
}

export default Data;
