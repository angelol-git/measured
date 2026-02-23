import { useState } from "react";
import { z } from "zod";

const measurementSchema = z.tuple([z.string(), z.string()]);

const itemSchema = z.object({
  active: z.boolean(),
  category: z.string(),
  id: z.string().uuid(),
  imageSrc: z.string().url(),
  measurements: z.record(measurementSchema),
  size: z.string(),
  title: z.string(),
});

const itemsImportSchema = z.record(z.string().uuid(), itemSchema);

function useImportedData({ items, setItems }) {
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");

  function handleImportClick(event) {
    if (event.key === "Enter" || event.type === "click") {
      document.getElementById("file").click();
    }
  }

  function handleExportClick() {
    const itemDataString = JSON.stringify(items, null, 2);
    const blob = new Blob([itemDataString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "measured_items.json";
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
        const result = itemsImportSchema.safeParse(jsonObject);
        if (result.success) {
          const importLength = Object.keys(result.data).length;
          setImportError("");
          setImportMessage(`Imported ${importLength} Items`);
          setItems(result.data);
        } else {
          setImportMessage(`${file.name}`);
          setImportError(
            `Invalid data format: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ")}`,
          );
        }
      } catch (error) {
        setImportMessage(`${file.name}`);
        setImportError(`Error reading JSON: ${error.message}`);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  }
  return {
    handleImportClick,
    handleExportClick,
    handleFileChange,
    importMessage,
    importError,
  };
}

export default useImportedData;
