/* global chrome */
import { useState, useEffect } from "react";

const DEFAULT_SETTINGS = {
  sizes: {
    Tops: ["S/44-46", "M/48-50", "L/52-54"],
    Bottoms: ["30", "32", "34"],
    Outerwear: ["S/44-46", "M/48-50", "L/52-54"],
  },
};

function useSettings() {
  const [settings, setSettings] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("settings", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to load settings from storage: ",
          chrome.runtime.lastError,
        );
        setIsLoaded(true);
        return;
      }
      setSettings(result.settings || DEFAULT_SETTINGS);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      chrome.storage.local.set({ settings }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Storage save failed: ",
            chrome.runtime.lastError.message,
          );
        }
      });
    }
  }, [isLoaded, settings]);

  function handleSizeUpdate(newSizes) {
    setSettings((prevSettings) => {
      return { ...prevSettings, sizes: newSizes };
    });
  }

  return [settings, handleSizeUpdate];
}

export default useSettings;
