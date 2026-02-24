/* global chrome */
import { imageData } from "./ssenseData.js";

let currentSystem = "inch";
let modalObserver = null;
const OBSERVER_TIMEOUT_MS = 10000;
const SIZE_CHANGE_DELAY_MS = 10;
const DECIMAL_PRECISION = 2;

document.addEventListener("click", (e) => {
  if (e.target.closest(".pdp-size-chart__view-guide")) {
    requestAnimationFrame(() => {
      const modal = document.querySelector(".modal-container-outer");
      if (modal) observeModalContent(modal);
    });
  }
});

function observeModalContent(modal) {
  if (modalObserver) modalObserver.disconnect();

  if (isModalReady(modal)) {
    handleMeasurementModal(modal);
    return;
  }

  modalObserver = new MutationObserver(() => {
    if (isModalReady(modal)) {
      modalObserver.disconnect();
      handleMeasurementModal(modal);
    }
  });

  modalObserver.observe(modal, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    modalObserver?.disconnect();
  }, OBSERVER_TIMEOUT_MS);
}

function isModalReady(modal) {
  const header = modal.querySelector(".pdp-size-chart__tab-links");
  const measurementModalImage = modal.querySelector(
    ".pdp-size-chart__guide-image-measurements",
  );

  return (
    header &&
    measurementModalImage &&
    header.children[0]?.innerText !== "SIZE CONVERSION CHART"
  );
}

async function handleMeasurementModal(modal) {
  let category = getSSenseCategory();
  if (!category) {
    console.warn("Measured: Unknown category for this product");
    return;
  }

  const activeItem = await getActiveItem(category);
  if (activeItem === -1) {
    console.warn("Measured: No active items.");
    return;
  }

  const measurementModalImage = modal.querySelector(
    ".pdp-size-chart__guide-image-measurements",
  );
  const imgSrc = measurementModalImage.children[0].src;
  if (!imgSrc) {
    console.warn("Measured: No measurement image found.");
    return;
  }

  if (!imageData[category] || !imageData[category][imgSrc]) {
    console.warn("Measured: No mapping found for this image.");
    return;
  }

  const measurementMap = imageData[category][imgSrc];
  const measurementList = measurementModalImage.children[1];
  modal.addEventListener("click", (e) => {
    const target = e.target;

    // Unit buttons either Inch or CM
    const unitBtn = target.closest(".pdp-size-chart__unit-buttons-list");
    if (unitBtn) {
      const isCm = target.innerText?.trim().includes("CM");
      currentSystem = isCm ? "cm" : "inch";
      compareMeasurements(measurementList, activeItem, measurementMap);
      return;
    }

    if (target.closest(".pdp-size-chart__size-buttons-list")) {
      setTimeout(
        () => compareMeasurements(measurementList, activeItem, measurementMap),
        SIZE_CHANGE_DELAY_MS,
      );
      return;
    }

    if (target.closest(".modal-close, .modal-btn-close, #backdrop")) {
      currentSystem = "inch";
    }
  });
  //Initial comparison run
  compareMeasurements(measurementList, activeItem, measurementMap);
}

function compareMeasurements(measurementList, activeItem, measurementMap) {
  deletePreviousMeasurements();
  const originalMeasurements = getOriginalMeasurements(
    measurementList,
    measurementMap,
  );
  const activeKeys = Object.keys(activeItem.measurements);

  displayActiveTitle(measurementList, activeItem);
  for (let i = 0; i < activeKeys.length; i++) {
    if (Object.hasOwn(originalMeasurements, activeKeys[i])) {
      let activeValue =
        currentSystem === "inch"
          ? activeItem.measurements[activeKeys[i]][0]
          : activeItem.measurements[activeKeys[i]][1];
      let valueDifference = (
        originalMeasurements[activeKeys[i]].measurement - activeValue
      ).toFixed(DECIMAL_PRECISION);
      displayDifferences(
        originalMeasurements[activeKeys[i]].element,
        valueDifference,
        activeValue,
      );
    }
  }
}

function getOriginalMeasurements(measurementList, measurementMap) {
  const measurements = {};
  for (let i = 0; i < measurementList.children.length; i++) {
    const parsedItem = measurementList.children[i];
    const mapKey = parsedItem.style.cssText;
    if (measurementMap[mapKey]) {
      measurements[measurementMap[mapKey]] = {
        element: parsedItem,
        measurement: parsedItem.innerText.split(" ")[0],
      };
    }
  }
  return measurements;
}

function displayActiveTitle(measurementList, item) {
  const activeTitle = document.createElement("div");
  activeTitle.classList.add("measured-difference");

  const p = document.createElement("p");
  p.textContent = "Measured: Comparing to ";
  const span = document.createElement("span");
  span.style.color = "#888";
  span.textContent = item.title;

  p.appendChild(span);
  activeTitle.appendChild(p);

  measurementList.parentNode.parentNode.insertBefore(
    activeTitle,
    measurementList.parentNode,
  );
}

function displayDifferences(listItemElement, difference, activeValue) {
  const newDifferenceElement = document.createElement("p");
  newDifferenceElement.classList.add("measured-difference");
  newDifferenceElement.style.whiteSpace = "nowrap";

  const sign = difference > 0 ? "+" : "";
  const color = difference > 0 ? "blue" : "#B35C00";
  const unit = currentSystem === "inch" ? ' "' : " cm";

  const outerSpan = document.createElement("span");
  outerSpan.style.backgroundColor = "white";

  if (parseFloat(difference) === 0.0) {
    const valueSpan = document.createElement("span");
    valueSpan.style.color = "#888";
    valueSpan.textContent = `${activeValue}${unit} = `;
    outerSpan.appendChild(valueSpan);
    outerSpan.appendChild(document.createElement("br"));
  } else {
    const valueSpan = document.createElement("span");
    valueSpan.style.color = "#888";
    valueSpan.textContent = `${activeValue}${unit}`;
    outerSpan.appendChild(valueSpan);
    outerSpan.appendChild(document.createElement("br"));

    const diffSpan = document.createElement("span");
    diffSpan.style.color = color;
    diffSpan.textContent = `${sign}${difference} ${unit}`;
    outerSpan.appendChild(diffSpan);
  }

  newDifferenceElement.appendChild(outerSpan);
  listItemElement.appendChild(newDifferenceElement);
}

function deletePreviousMeasurements() {
  const prevDifference = document.querySelectorAll(".measured-difference");
  prevDifference.forEach((el) => el.remove());
}

async function getActiveItem(category) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "getItem", key: "items", category: category },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Chrome runtime error:", chrome.runtime.lastError);
          resolve(-1);
          return;
        }
        const item = response?.items || {};
        if (Object.keys(item).length === 0) {
          resolve(-1);
        } else {
          resolve(Object.values(item)[0]);
        }
      },
    );
  });
}

function getSSenseCategory() {
  const categoryElement = document.getElementById("pdpProductNameText");
  if (!categoryElement) return null;
  const text = categoryElement.innerText.trim();
  if (
    /T-Shirt|Henley|Polo|Tank Top|Cardigan|Sweater|Hoodie|Sweatshirt|Turtleneck/.test(
      text,
    )
  )
    return "Tops";

  if (/Jacket|Bomber|Coat|Peacoat|Vest/.test(text)) return "Outerwear";
  if (/Pants|Trousers|Sweatpants|Jeans/.test(text)) return "Bottoms";
  return null;
}
