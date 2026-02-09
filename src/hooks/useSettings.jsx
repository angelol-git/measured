/* global chrome */
import { useState, useEffect } from "react";

function useSettings() {
  const [settings, setSettings] = useState({
    sizes: {
      Tops: ["S/44-46", "M/48-50", "L/52-54"],
      Bottoms: ["30", "32", "34"],
      Outerwear: ["S/44-46", "M/48-50", "L/52-54"],
    },
  });

  useEffect(() => {
    chrome.storage.local.get("settings", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to load settings from storage: ",
          chrome.runtime.lastError,
        );
        return;
      }
      if (result.settings) {
        setSettings(result.settings);
      } else {
        chrome.storage.local.set({ settings });
      }
    });
  }, [settings]);

  useEffect(() => {
    chrome.storage.local.set({ settings }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Storage save failed: ",
          chrome.runtime.lastError.message,
        );
      }
    });
  }, [settings]);

  function handleSizeUpdate(newSizes) {
    setSettings((prevSettings) => {
      return { ...prevSettings, sizes: newSizes };
    });
  }

  return [settings, handleSizeUpdate];
}

export default useSettings;
