function sizeGuideMutationObserver() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const sizeGuideButton = document.querySelectorAll('.pdp-size-chart__model-wearing')[1];
        if (sizeGuideButton) {
            console.log("Measured: Found button.");
            sizeGuideButton.addEventListener('click', () => {
                modalMutationObserver();
            });
            observer.disconnect();
        }
    });
    const containerToObserve = document.querySelector('.pdp-header__right');
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

function modalMutationObserver() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const measurementModal = document.querySelector('.modal-container-outer');
        const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
        const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
        if (measurementModalHeader && measurementValuesElement) {
            console.log("Measured: Multiple elements loaded.");
            compareMeasurements(measurementModal);
            observer.disconnect();
        }
    });
    const containerToObserve = document.querySelector('.modal-container-outer');
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

async function compareMeasurements(measurementModal) {
    const validModal = validSSenseMeasurements(measurementModal);
    if (validModal === -1) {
        console.log("Measured: Error - No measurements provided.");
        return;
    }

    const category = getSSenseCategory();
    const activeItem = await validActiveItem(category);
    if (activeItem === -1) {
        console.log("Measured: Error - No active items.")
        return;
    }

    const originalMeasurements = getOriginalMeasurements(measurementModal)
    if (originalMeasurements === -1) {
        console.log("Measured: Error - parsing data.")
        return;
    }

    const measurementDifferences = compareSSenseMeasurements(originalMeasurements, activeItem);
    const measurementValueElements = Array.from(measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1].children);
    for (const key in measurementDifferences) {
        const measurementValueElement = measurementValueElements.filter((item) => {
            return item.style.cssText === originalMeasurements[key].cssPosition;
        })[0];
        displaySSenseDifference(measurementValueElement, measurementDifferences[key].inchDifference, originalMeasurements[key].originalInch, "inch", false);
    }
    // displayGrailedCompareItem(measurementTable, item);

    toggleUnitSystems(measurementValueElements, measurementDifferences, originalMeasurements);
}

function validSSenseMeasurements(measurementModal) {
    const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
    if (measurementModalHeader.children.length === 1) {
        return -1;
    }
    return 1;
}
function getSSenseCategory() {
    const categoryElement = document.getElementById("pdpProductNameText");
    const categoryElementText = categoryElement.innerText.trim();
    if (categoryElementText.includes("T-Shirt") ||
        categoryElementText.includes("Henley") ||
        categoryElementText.includes("Polo") ||
        categoryElementText.includes("Tank Top")) {
        return "Tops";
    }
    else if (categoryElementText.includes("Cardigan") ||
        categoryElementText.includes("Sweater") ||
        categoryElementText.includes("Hoodie") ||
        categoryElementText.includes("Sweatshirt") ||
        categoryElementText.includes("Turtleneck")) {
        return "Tops";
    }

    else if (categoryElementText.includes("Jacket") ||
        categoryElementText.includes("Bomber") ||
        categoryElementText.includes("Coat") ||
        categoryElementText.includes("Peacoat") ||
        categoryElementText.includes("Vest")) {
        return "Outerwear";
    }
}

async function validActiveItem(category) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'getItem', key: 'items', category: category }, (response) => {
            const item = response.items;
            if (Object.keys(item).length === 0) {
                resolve(-1);
            }
            else {
                resolve(Object.values(item)[0]);
            }
        });
    });
}
function getOriginalMeasurements(measurementModal) {
    const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
    if (!measurementValuesElement) {
        return -1;
    }
    const originalMeasurements = {};

    //Currently only works with t-shirts because of the image.
    const measurementCategory = {
        "left: 45%; top: 40%;": "Chest",
        "left: 12%; top: 18%;": "Sleeve Length",
        "left: 45%; top: 6%;": "Shoulders",
        "left: 90%; top: 55%;": "Length"
    };

    for (let i = 0; i < measurementValuesElement.children.length; i++) {
        const cssPosition = measurementValuesElement.children[i].style.cssText;
        const originalInch = (measurementValuesElement.children[i].innerText.split(" ")[0]);
        const originalCm = (Math.trunc(originalInch * 2.54)).toString();
        if (measurementCategory.hasOwnProperty(cssPosition)) {
            originalMeasurements[measurementCategory[cssPosition]] = {
                cssPosition,
                originalInch,
                originalCm
            };
        }
    }

    return originalMeasurements;
}

function compareSSenseMeasurements(originalMeasurements, item) {
    const activeKeys = Object.keys(item.measurements);
    const parsedKeys = Object.keys(originalMeasurements);
    const commonKeys = parsedKeys.filter((key) => activeKeys.includes(key));
    const difference = {};

    for (const key of commonKeys) {
        const activeValue = (item.measurements[key])

        const parsedValue = (originalMeasurements[key])
        const inchDifference = (parsedValue.originalInch - activeValue[0]).toFixed(2);
        const cmDifference = (parsedValue.originalCm - activeValue[1]).toFixed(2);

        difference[key] = {
            inchDifference,
            cmDifference
        };
    }

    return difference;
}

function displaySSenseDifference(measurementElement, difference, system, initial = true) {
    let formattedDifference = difference;
    const newNode = document.createElement("p");
    newNode.setAttribute('class', 'measured-difference');
    newNode.innerHTML = ` ${formattedDifference}"`;

    if (parseFloat(difference) === 0.00) {
        formattedDifference = "=";
    }
    if (system === "inch") {
        measurementElement.appendChild(newNode);
    }
    else {
        measurementElement.appendChild(newNode);
    }
}

function toggleUnitSystems(measurementValueElements, measurementDifferences, originalMeasurements) {
    const inchButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[0];
    const cmButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[1];
    inchButton.addEventListener('click', () => {
        removePreviousMeasurements();
        for (const key in measurementDifferences) {
            const measurementValueElement = measurementValueElements.filter((item) => {
                return item.style.cssText === originalMeasurements[key].cssPosition;
            })[0];
            displaySSenseDifference(measurementValueElement, measurementDifferences[key].inchDifference, "inch", false);
        }
    })
    cmButton.addEventListener('click', () => {
        removePreviousMeasurements();
        for (const key in measurementDifferences) {
            const measurementValueElement = measurementValueElements.filter((item) => {
                return item.style.cssText === originalMeasurements[key].cssPosition;
            })[0];
            displaySSenseDifference(measurementValueElement, measurementDifferences[key].cmDifference, "cm", false);
        }
    })
}

function removePreviousMeasurements() {
    const prevDifference = document.querySelectorAll('.measured-difference');
    if (prevDifference) {
        for (var i = 0, len = prevDifference.length; i < len; i++) {
            prevDifference[i].remove();
        }
    }
}
sizeGuideMutationObserver();