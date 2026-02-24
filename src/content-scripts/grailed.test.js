import { describe, it, expect } from "vitest";
import { getOriginalMeasurements, formatDifferenceNode } from "./grailed.js";

describe("grailed.js - Basic Tests", () => {
  describe("getOriginalMeasurements", () => {
    it("should parse a simple measurement table", () => {
      // Create a mock DOM table element
      const mockTable = document.createElement("table");
      const row = document.createElement("tr");

      // Create cells with text content (jsdom compatible)
      // innerText in real browser would have newlines between cells
      const nameCell = document.createElement("td");
      nameCell.textContent = "Chest";

      const inchCell = document.createElement("td");
      inchCell.textContent = "22 in";

      const cmCell = document.createElement("td");
      cmCell.textContent = "55.88 cm";

      row.appendChild(nameCell);
      row.appendChild(inchCell);
      row.appendChild(cmCell);

      // Mock innerText for jsdom compatibility
      Object.defineProperty(row, "innerText", {
        get: () => "Chest\n22 in\n55.88 cm",
      });

      mockTable.appendChild(row);

      const result = getOriginalMeasurements(mockTable);

      expect(result.Chest).toBeDefined();
      expect(result.Chest.measurements).toEqual(["22", "55.88"]);
    });

    it("should return empty object for null table", () => {
      const result = getOriginalMeasurements(null);
      expect(result).toEqual({});
    });

    it("should return empty object for empty table", () => {
      const mockTable = document.createElement("table");
      const result = getOriginalMeasurements(mockTable);
      expect(result).toEqual({});
    });
  });

  describe("formatDifferenceNode", () => {
    it("should format exact match as grey equals sign", () => {
      const span = formatDifferenceNode("0.00", "0.00", "in");

      expect(span.style.color).toBe("grey");
      expect(span.textContent).toBe("=");
    });

    it("should format positive difference in green with plus sign", () => {
      const span = formatDifferenceNode("2.50", "6.35", "in");

      expect(span.style.color).toBe("green");
      expect(span.textContent).toBe("+2.50 in");
    });

    it("should format negative difference in red without plus sign", () => {
      const span = formatDifferenceNode("-1.25", "-3.18", "cm");
      expect(span.style.color).toBe("red");
      expect(span.textContent).toBe("-1.25 cm");
    });
  });
});
