import { createContext, useContext } from "react";
import useSettings from "../hooks/useSettings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, handleSizeUpdate] = useSettings();

  const value = {
    settings,
    handleSizeUpdate,
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
}

export default SettingsContext;
