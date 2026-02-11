/* global chrome */

const OBSERVER_TIMEOUT_MS = 10000;

function mutationObserverTable() {
  const sideBarContainer = document.querySelector(
    '[class*="Sidebar_sidebar__"]',
  );

  if (!sideBarContainer) {
    console.warn("Measured: Sidebar not found.");
    return;
  }

  const config = { childList: true, subtree: true };

  const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;

          const measurementTable = node.matches('[class*="Table_table__"]')
            ? node
            : node.querySelector('[class*="Table_table__"]');

          const requestButton = node.matches(
            '[class*="RequestAction_button__"]',
          )
            ? node
            : node.querySelector('[class*="RequestAction_button__"]');

          if (measurementTable || requestButton) {
            observer.disconnect();
            clearTimeout(timeoutId);

            if (measurementTable) {
              handleMeasurementTable(measurementTable);
            } else {
              console.warn("Measured: No measurements provided.");
            }
            return;
          }
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(sideBarContainer, config);

  const timeoutId = setTimeout(() => {
    observer.disconnect();
    console.warn("Measured: Timeout - stopped observing");
  }, OBSERVER_TIMEOUT_MS);
}

async function handleMeasurementTable(measurementTable) {
  let category = getGrailedCategory();
  const activeItem = await getActiveItem(category);

  if (activeItem === -1) {
    console.warn("Measured: No active items.");
    return;
  }

  compareMeasurements(measurementTable, activeItem);
}

function getGrailedCategory() {
  const nextDataScript = document.getElementById("__NEXT_DATA__");
  if (!nextDataScript) return getGrailedCategoryBreadCrumbs();

  try {
    const data = JSON.parse(nextDataScript.textContent);
    const listing = data.props?.pageProps?.listing;

    if (!listing) return null;
    //  department: listing.department,
    //  category: listing.category,
    //  subcategory: listing.subcategory,
    //  fullPath: listing.categoryPath,
    return listing.category.charAt(0).toUpperCase() + listing.category.slice(1);
  } catch (e) {
    console.error("Failed to parse __NEXT_DATA__:", e);
    return getGrailedCategoryBreadCrumbs();
  }
}

function getGrailedCategoryBreadCrumbs() {
  const classList = document.querySelectorAll('[class*="Breadcrumbs_link__"]');
  if (classList.length < 3) return null;

  const lastElement = classList[2].innerText.split(" ").length;
  return classList[2].innerText.split(" ")[lastElement - 1];
}

async function getActiveItem(category) {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      { action: "getItem", key: "items", category: category },
      (response) => {
        // eslint-disable-next-line no-undef
        if (chrome.runtime.lastError || !response?.items) {
          resolve(-1);
          return;
        }

        const item = response.items;
        if (Object.keys(item).length === 0) {
          resolve(-1);
        } else {
          resolve(Object.values(item)[0]);
        }
      },
    );
  });
}

function compareMeasurements(measurementTable, activeItem) {
  const originalMeasurements = getOriginalMeasurements(measurementTable);
  const activeKeys = Object.keys(activeItem.measurements);

  displayActiveTitle(measurementTable, activeItem);
  for (let i = 0; i < activeKeys.length; i++) {
    if (Object.hasOwn(originalMeasurements, activeKeys[i])) {
      const activeValues = activeItem.measurements[activeKeys[i]];
      const originalValues = originalMeasurements[activeKeys[i]].measurements;

      const inchDifference = (originalValues[0] - activeValues[0]).toFixed(2);
      const cmDifference = (originalValues[1] - activeValues[1]).toFixed(2);

      displayDifferences(
        originalMeasurements[activeKeys[i]].element,
        inchDifference,
        cmDifference,
        originalValues[0],
        originalValues[1],
        activeValues[0],
        activeValues[1],
      );
    }
  }
}

function getOriginalMeasurements(measurementTable) {
  if (!measurementTable?.children?.length) return {};

  const measurements = {};
  for (let i = 0; i < measurementTable.children.length; i++) {
    const parsedRow = measurementTable.children[i].innerText
      .split("\n")
      .filter(Boolean);

    measurements[parsedRow[0]] = {
      element: measurementTable.children[i],
      measurements: [parsedRow[1].split(" ")[0], parsedRow[2].split(" ")[0]],
    };
  }
  return measurements;
}

function displayActiveTitle(measurementTable, item) {
  const activeTitle = document.createElement("div");
  activeTitle.innerHTML += `<p style="font-size:1.4rem;text-align:right">
            Measured: Comparing to <span style="color:grey">${item.title}</span>
        </p>`;
  measurementTable.parentNode.insertBefore(activeTitle, measurementTable);
}

function displayDifferences(
  tableRowElement,
  inchDifference,
  cmDifference,
  originalInch,
  originalCm,
  activeInch,
  activeCm,
) {
  // eslint-disable-next-line no-unused-vars
  const [_, inchCell, cmCell] = tableRowElement.children;

  function formatDifference(value, value2, unit) {
    const num = parseFloat(value);
    //accommodate for edge cases due to rounding conversation errors
    const num2 = parseFloat(value2);
    if (num === 0 || num2 === 0) return `<span style="color: grey;>=</span>`;
    const color = num > 0 ? "green" : "red";
    const sign = num > 0 ? "+" : "";
    return `<span style="color: ${color};">${sign}${value} ${unit}</span>`;
  }

  inchCell.innerHTML = `${originalInch}<span style="color: grey;">/${activeInch}</span> 
                        <br> ${formatDifference(
                          inchDifference,
                          cmDifference,
                          "in",
                        )}`;
  cmCell.innerHTML = `${originalCm}<span style="color: grey;">/${activeCm}</span> 
                        <br> ${formatDifference(
                          cmDifference,
                          inchDifference,
                          "cm",
                        )}`;
}

mutationObserverTable();
